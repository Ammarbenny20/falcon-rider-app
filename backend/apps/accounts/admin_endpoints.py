"""
Admin read-only list endpoints. Gated by IsAdmin.
"""
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin

from apps.journeys.models import Journey
from apps.payments.models import Payment
from apps.rider_requests.models import RiderRequest
from apps.safety.models import SosAlert

from .models import ProviderProfile


def _paginate(request, qs, serializer_fn):
    try:
        page = int(request.query_params.get("page", 1))
        size = min(int(request.query_params.get("page_size", 20)), 100)
    except ValueError:
        page, size = 1, 20
    start = (page - 1) * size
    end = start + size
    total = qs.count()
    items = qs[start:end]
    return {
        "count": total,
        "page": page,
        "page_size": size,
        "results": [serializer_fn(x) for x in items],
    }


class AdminProviderListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = ProviderProfile.objects.select_related("user").order_by("-created_at")

        def ser(p):
            return {
                "id": str(p.id),
                "user_id": str(p.user_id),
                "email": p.user.email,
                "full_name": p.user.full_name,
                "phone_number": p.user.phone_number,
                "verification_status": p.verification_status,
                "professional_availability": p.professional_availability,
                "community_availability": p.community_availability,
                "capabilities": p.capabilities,
                "capability_status": p.capability_status,
                "rating": str(p.rating),
                "total_journeys": p.total_journeys,
                "created_at": p.created_at.isoformat(),
            }

        return Response(_paginate(request, qs, ser))


class AdminProviderDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        try:
            p = ProviderProfile.objects.select_related("user").get(pk=pk)
        except ProviderProfile.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        return Response({
            "id": str(p.id),
            "user_id": str(p.user_id),
            "email": p.user.email,
            "full_name": p.user.full_name,
            "phone_number": p.user.phone_number,
            "verification_status": p.verification_status,
            "professional_availability": p.professional_availability,
            "community_availability": p.community_availability,
            "capabilities": p.capabilities,
            "capability_status": p.capability_status,
            "rating": str(p.rating),
            "total_journeys": p.total_journeys,
            "created_at": p.created_at.isoformat(),
        })


class AdminRideListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = RiderRequest.objects.select_related("passenger__user").order_by("-created_at")

        def ser(r):
            return {
                "id": str(r.id),
                "passenger_id": str(r.passenger_id),
                "passenger_email": r.passenger.user.email,
                "origin_label": r.origin_label,
                "destination_label": r.destination_label,
                "requested_time": r.requested_time.isoformat(),
                "status": r.status,
                "booking_type": r.booking_type,
                "transport_mode": r.transport_mode,
                "seats_needed": r.seats_needed,
                "created_at": r.created_at.isoformat(),
            }

        return Response(_paginate(request, qs, ser))


class AdminTripListView(APIView):
    """Professional trips (JourneyPlan with journey_type=PROFESSIONAL)."""
    permission_classes = [IsAdmin]

    def get(self, request):
        from apps.journey_plans.models import JourneyPlan

        qs = JourneyPlan.objects.filter(
            journey_type="PROFESSIONAL",
        ).select_related("provider__user", "vehicle").order_by("-created_at")

        s = request.query_params.get("status")
        if s:
            qs = qs.filter(status=s.upper())

        def ser(p):
            return {
                "id": str(p.id),
                "provider_id": str(p.provider.id),
                "provider_email": p.provider.user.email,
                "provider_name": p.provider.user.full_name,
                "vehicle_id": str(p.vehicle.id),
                "journey_type": p.journey_type,
                "origin": {"latitude": p.origin.y, "longitude": p.origin.x, "label": p.origin_label},
                "destination": {"latitude": p.destination.y, "longitude": p.destination.x, "label": p.destination_label},
                "scheduled_departure_time": p.scheduled_departure_time.isoformat(),
                "total_seats": p.total_seats,
                "available_seats": p.available_seats,
                "price_per_seat": str(p.price_per_seat),
                "status": p.status,
                "created_at": p.created_at.isoformat(),
            }

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
            "results": [ser(p) for p in items],
        })



class AdminPaymentListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Payment.objects.order_by("-initiated_at")

        def ser(p):
            return {
                "id": str(p.id),
                "amount": str(p.amount),
                "method": p.method,
                "status": p.status,
                "transaction_reference": p.transaction_reference,
                "initiated_at": p.initiated_at.isoformat(),
                "completed_at": p.completed_at.isoformat() if p.completed_at else None,
            }

        return Response(_paginate(request, qs, ser))


class AdminSafetyListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = SosAlert.objects.select_related("user").order_by("-created_at")

        def ser(a):
            return {
                "id": str(a.id),
                "user_id": str(a.user_id),
                "user_email": a.user.email,
                "journey_id": str(a.journey_id) if a.journey_id else None,
                "message": a.message,
                "resolved": a.resolved,
                "created_at": a.created_at.isoformat(),
            }

        return Response(_paginate(request, qs, ser))


class AdminAuditLogListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        from core.audit import AuditLog
        qs = AuditLog.objects.select_related("user").order_by("-created_at")

        # Filters
        action = request.query_params.get("action")
        target_type = request.query_params.get("target_type")
        target_id = request.query_params.get("target_id")
        user_email = request.query_params.get("user_email")

        if action:
            qs = qs.filter(action__icontains=action)
        if target_type:
            qs = qs.filter(target_type__iexact=target_type)
        if target_id:
            qs = qs.filter(target_id=str(target_id))
        if user_email:
            qs = qs.filter(user__email__iexact=user_email)

        def ser(a):
            return {
                "id": str(a.id),
                "user_id": str(a.user_id) if a.user_id else None,
                "user_email": a.user.email if a.user else None,
                "action": a.action,
                "target_type": a.target_type,
                "target_id": a.target_id,
                "metadata": a.metadata,
                "request_id": a.request_id,
                "ip_address": a.ip_address,
                "created_at": a.created_at.isoformat(),
            }

        return Response(_paginate(request, qs, ser))
