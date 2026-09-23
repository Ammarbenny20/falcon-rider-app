from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import log_action
from core.permissions import IsAdmin

from apps.accounts.models import Notification, PushToken, User
from apps.bookings.models import Booking
from apps.journey_plans.models import JourneyPlan
from apps.payments.models import Payment
from apps.rider_requests.models import RiderRequest
from apps.vehicles.models import Vehicle

from .catalog import PERMISSIONS, ROLES
from .settings_store import get_settings, update_settings


# -----------------------------------------------------------------------------
# 6a — Staff, Roles, Permissions
# -----------------------------------------------------------------------------
class AdminStaffListView(APIView):
    """Users with admin-role — the people who can log into the admin portal."""
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = User.objects.filter(role="ADMIN", is_active=True).order_by("-created_at")
        return Response({
            "count": qs.count(),
            "results": [
                {
                    "id": str(u.id),
                    "email": u.email,
                    "full_name": u.full_name,
                    "phone_number": u.phone_number,
                    "role": u.role,
                    "status": u.status,
                    "is_staff": u.is_staff,
                    "is_verified": u.is_verified,
                    "created_at": u.created_at.isoformat(),
                }
                for u in qs
            ],
        })


class AdminRolesListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"count": len(ROLES), "results": ROLES})


class AdminPermissionsListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Group by group field for easier frontend rendering
        grouped = {}
        for p in PERMISSIONS:
            grouped.setdefault(p["group"], []).append({
                "code": p["code"],
                "name": p["name"],
            })
        return Response({
            "count": len(PERMISSIONS),
            "groups": [
                {"group": g, "permissions": perms}
                for g, perms in grouped.items()
            ],
        })


# -----------------------------------------------------------------------------
# 6b — Notifications Admin
# -----------------------------------------------------------------------------
class AdminNotificationsListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Notification.objects.select_related("user").order_by("-created_at")

        # Filters
        user_email = request.query_params.get("user_email")
        is_read = request.query_params.get("is_read")
        type_filter = request.query_params.get("type")

        if user_email:
            qs = qs.filter(user__email__iexact=user_email)
        if is_read is not None and is_read != "":
            qs = qs.filter(is_read=is_read.lower() == "true")
        if type_filter:
            qs = qs.filter(data__type=type_filter)

        try:
            page = int(request.query_params.get("page", 1))
            size = min(int(request.query_params.get("page_size", 20)), 100)
        except ValueError:
            page, size = 1, 20

        total = qs.count()
        items = qs[(page - 1) * size : page * size]

        return Response({
            "count": total,
            "page": page,
            "page_size": size,
            "results": [
                {
                    "id": str(n.id),
                    "user_id": str(n.user_id),
                    "user_email": n.user.email,
                    "title": n.title,
                    "body": n.body,
                    "data": n.data,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat(),
                }
                for n in items
            ],
        })


class AdminNotificationRetryView(APIView):
    """
    POST /admin/notifications/{id}/retry/
    Re-dispatch the push for a given notification.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            n = Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        tokens = list(PushToken.objects.filter(user=n.user).values_list("token", flat=True))
        if not tokens:
            return Response(
                {"detail": "User has no push tokens registered."},
                status=400,
            )

        # Best-effort push
        try:
            from apps.accounts.tasks.notification_tasks import dispatch_push
            for t in tokens:
                dispatch_push.delay(t, n.title, n.body, n.data or {})
        except Exception:
            # Fallback: log to console
            for t in tokens:
                print(f"📲 [PUSH-RETRY] {n.user.email} → {t}: {n.title} — {n.body}")

        log_action(
            user=request.user,
            action="admin.notification.retry",
            target_type="Notification",
            target_id=n.id,
            request=request,
        )

        return Response({
            "id": str(n.id),
            "tokens_targeted": len(tokens),
            "detail": "Push re-dispatched.",
        })


# -----------------------------------------------------------------------------
# 6c — Settings
# -----------------------------------------------------------------------------
class AdminSettingsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response(get_settings())

    def patch(self, request):
        if not isinstance(request.data, dict):
            return Response(
                {"detail": "Expected a JSON object."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        allowed = set(get_settings().keys())
        patch = {k: v for k, v in request.data.items() if k in allowed}
        if not patch:
            return Response(
                {"detail": f"No valid keys. Allowed: {sorted(allowed)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        updated = update_settings(patch)

        log_action(
            user=request.user,
            action="admin.settings.update",
            target_type="Settings",
            target_id="platform",
            metadata={"keys": list(patch.keys())},
            request=request,
        )

        return Response(updated)


# -----------------------------------------------------------------------------
# 6d — Global Search
# -----------------------------------------------------------------------------
class AdminGlobalSearchView(APIView):
    """
    GET /admin/search/?q=<query>
    Returns categorized results across users, providers, rides, trips,
    payments, vehicles.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        if len(q) < 2:
            return Response(
                {"detail": "Query must be at least 2 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        limit = 5

        # Users — match on email, phone, full_name
        users = User.objects.filter(
            Q(email__icontains=q) |
            Q(phone_number__icontains=q) |
            Q(full_name__icontains=q)
        )[:limit]

        # Providers — via user
        providers = User.objects.filter(
            role="PROVIDER",
        ).filter(
            Q(email__icontains=q) |
            Q(phone_number__icontains=q) |
            Q(full_name__icontains=q)
        )[:limit]

        # Rides — match on labels
        rides = RiderRequest.objects.filter(
            Q(origin_label__icontains=q) |
            Q(destination_label__icontains=q)
        )[:limit]

        # Trips — via journey_plan labels
        trips = JourneyPlan.objects.filter(
            Q(origin_label__icontains=q) |
            Q(destination_label__icontains=q)
        )[:limit]

        # Payments — match transaction_reference
        payments = Payment.objects.filter(
            transaction_reference__icontains=q
        )[:limit]

        # Vehicles — match plate, make, model
        vehicles = Vehicle.objects.filter(
            Q(license_plate__icontains=q) |
            Q(make__icontains=q) |
            Q(model__icontains=q)
        )[:limit]

        return Response({
            "query": q,
            "customers": [
                {"id": str(u.id), "email": u.email, "name": u.full_name, "role": u.role}
                for u in users
            ],
            "providers": [
                {"id": str(u.id), "email": u.email, "name": u.full_name}
                for u in providers
            ],
            "rides": [
                {"id": str(r.id), "origin": r.origin_label, "destination": r.destination_label, "status": r.status}
                for r in rides
            ],
            "trips": [
                {"id": str(t.id), "origin": t.origin_label, "destination": t.destination_label, "status": t.status}
                for t in trips
            ],
            "payments": [
                {"id": str(p.id), "reference": p.transaction_reference, "amount": str(p.amount), "status": p.status}
                for p in payments
            ],
            "vehicles": [
                {"id": str(v.id), "plate": v.license_plate, "make": v.make, "model": v.model}
                for v in vehicles
            ],
        })
