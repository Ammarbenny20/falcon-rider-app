"""
Extended admin endpoints — provider actions, user management.
"""
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import log_action
from core.permissions import IsAdmin

from .models import ProviderProfile, User
from .notifications_service import (
    notify_provider_verified, notify_provider_rejected,
)
from .serializers import ProviderProfileSerializer


# -----------------------------------------------------------------------------
# Providers
# -----------------------------------------------------------------------------
class AdminPendingProvidersView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = ProviderProfile.objects.filter(
            verification_status__in=["REGISTERED", "PENDING_VERIFICATION"],
        ).select_related("user").order_by("-created_at")

        def ser(p):
            return {
                "id": str(p.id),
                "user_id": str(p.user_id),
                "email": p.user.email,
                "full_name": p.user.full_name,
                "phone_number": p.user.phone_number,
                "verification_status": p.verification_status,
                "license_number": p.license_number,
                "vehicle_type": p.vehicle_type,
                "capabilities": p.capabilities,
                "capability_status": p.capability_status,
                "created_at": p.created_at.isoformat(),
            }

        return Response([ser(p) for p in qs])


class AdminProviderActionView(APIView):
    """
    POST /admin/providers/{id}/<action>/
    Actions: approve, reject, suspend
    """
    permission_classes = [IsAdmin]

    def post(self, request, provider_id, action):
        provider = get_object_or_404(ProviderProfile, pk=provider_id)

        mapping = {
            "approve": "VERIFIED",
            "reject": "REJECTED",
            "suspend": "SUSPENDED",
        }
        if action not in mapping:
            return Response(
                {"detail": f"Unknown action: {action}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider.verification_status = mapping[action]
        provider.save(update_fields=["verification_status", "updated_at"])

        try:
            if action == "approve":
                notify_provider_verified(provider)
            elif action == "reject":
                notify_provider_rejected(provider, request.data.get("reason", ""))
        except Exception:
            pass

        log_action(
            user=request.user,
            action=f"admin.provider.{action}",
            target_type="ProviderProfile",
            target_id=provider.id,
            metadata={"reason": request.data.get("reason", "")},
            request=request,
        )

        return Response(ProviderProfileSerializer(provider).data)


# -----------------------------------------------------------------------------
# Users
# -----------------------------------------------------------------------------
class AdminUserListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        role = request.query_params.get("role")
        status_filter = request.query_params.get("status")
        qs = User.objects.all().order_by("-created_at")
        if role:
            qs = qs.filter(role=role.upper())
        if status_filter:
            qs = qs.filter(status=status_filter.upper())

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
                    "id": str(u.id),
                    "email": u.email,
                    "phone_number": u.phone_number,
                    "full_name": u.full_name,
                    "role": u.role,
                    "status": u.status,
                    "is_verified": u.is_verified,
                    "is_active": u.is_active,
                    "created_at": u.created_at.isoformat(),
                }
                for u in items
            ],
        })


class AdminUserDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        u = get_object_or_404(User, pk=pk)
        return Response({
            "id": str(u.id),
            "email": u.email,
            "phone_number": u.phone_number,
            "full_name": u.full_name,
            "role": u.role,
            "status": u.status,
            "is_verified": u.is_verified,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat(),
        })


class AdminUserActionView(APIView):
    """
    POST /admin/users/{id}/<action>/
    Actions: suspend, activate
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk, action):
        u = get_object_or_404(User, pk=pk)

        if action == "suspend":
            u.status = "SUSPENDED"
            u.is_active = False
        elif action == "activate":
            u.status = "ACTIVE"
            u.is_active = True
        else:
            return Response(
                {"detail": f"Unknown action: {action}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        u.save(update_fields=["status", "is_active", "updated_at"])

        log_action(
            user=request.user,
            action=f"admin.user.{action}",
            target_type="User",
            target_id=u.id,
            request=request,
        )

        return Response({
            "id": str(u.id),
            "status": u.status,
            "is_active": u.is_active,
        })


class AdminProviderCapabilityActionView(APIView):
    """
    POST /admin/providers/{id}/<capability>/<action>/
    capability: PROFESSIONAL_SERVICE | COMMUNITY_JOURNEY
    action: approve | reject | suspend
    Updates only that capability's status in capability_status.
    """
    permission_classes = [IsAdmin]

    CAPABILITY_MAP = {
        "professional": "PROFESSIONAL_SERVICE",
        "community": "COMMUNITY_JOURNEY",
    }
    ACTION_MAP = {
        "approve": "APPROVED",
        "reject": "REJECTED",
        "suspend": "SUSPENDED",
    }

    def post(self, request, provider_id, capability, action):
        provider = get_object_or_404(ProviderProfile, pk=provider_id)

        cap_key = self.CAPABILITY_MAP.get(capability.lower())
        if not cap_key:
            return Response(
                {"detail": f"Unknown capability: {capability}. Use 'professional' or 'community'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_status = self.ACTION_MAP.get(action.lower())
        if not new_status:
            return Response(
                {"detail": f"Unknown action: {action}. Use 'approve', 'reject', or 'suspend'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the capability_status JSONField
        cap_status = dict(provider.capability_status or {})
        cap_status[cap_key] = new_status
        provider.capability_status = cap_status

        # Ensure the capability is in the capabilities list
        caps = list(provider.capabilities or [])
        if cap_key not in caps:
            caps.append(cap_key)
        provider.capabilities = caps
        provider.save(update_fields=["capabilities", "capability_status", "updated_at"])

        # Fire notification on approve/reject
        try:
            if action == "approve":
                notify_provider_verified(provider)
            elif action == "reject":
                notify_provider_rejected(provider, request.data.get("reason", ""))
        except Exception:
            pass

        log_action(
            user=request.user,
            action=f"admin.provider.{capability}.{action}",
            target_type="ProviderProfile",
            target_id=provider.id,
            metadata={"capability": cap_key, "status": new_status},
            request=request,
        )

        return Response(ProviderProfileSerializer(provider).data)
