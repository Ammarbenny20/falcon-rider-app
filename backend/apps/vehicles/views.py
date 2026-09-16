from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.vehicles.models import Vehicle, VehicleStatus
from apps.providers.models import VerificationStatus
from apps.vehicles.serializers import VehicleSerializer
from permissions.roles import IsProvider, IsAdminRole


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Vehicle.objects.all().order_by("-created_at")
        provider = getattr(user, "provider_profile", None)
        return Vehicle.objects.filter(provider=provider)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsProvider()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        provider = self.request.user.provider_profile
        serializer.save(provider=provider, status=VehicleStatus.PENDING_VERIFICATION)

    # --- admin verification actions (spec section 41) ---

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def verify(self, request, pk=None):
        vehicle = self.get_object()
        vehicle.verification_status = VerificationStatus.APPROVED
        vehicle.status = VehicleStatus.ACTIVE
        vehicle.save(update_fields=["verification_status", "status"])
        self._audit(request.user, "VEHICLE_VERIFIED", vehicle)
        return Response(VehicleSerializer(vehicle).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def reject(self, request, pk=None):
        vehicle = self.get_object()
        vehicle.verification_status = VerificationStatus.REJECTED
        vehicle.save(update_fields=["verification_status"])
        self._audit(request.user, "VEHICLE_REJECTED", vehicle)
        return Response(VehicleSerializer(vehicle).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def suspend(self, request, pk=None):
        vehicle = self.get_object()
        vehicle.status = VehicleStatus.SUSPENDED
        vehicle.save(update_fields=["status"])
        self._audit(request.user, "VEHICLE_SUSPENDED", vehicle)
        return Response(VehicleSerializer(vehicle).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def reactivate(self, request, pk=None):
        vehicle = self.get_object()
        vehicle.status = VehicleStatus.ACTIVE
        vehicle.save(update_fields=["status"])
        self._audit(request.user, "VEHICLE_REACTIVATED", vehicle)
        return Response(VehicleSerializer(vehicle).data)

    def _audit(self, admin_user, action_name, vehicle):
        from apps.administration.models import AuditLog
        AuditLog.objects.create(
            actor=admin_user, action=action_name, entity="Vehicle", entity_id=str(vehicle.id)
        )