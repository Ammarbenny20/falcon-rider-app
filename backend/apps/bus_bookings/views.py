from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.bus_bookings.models import BusBooking, BusBookingStatus
from apps.bus_bookings.serializers import BusBookingSerializer
from apps.bus_bookings.services import transition
from permissions.roles import IsAdminRole


class BusBookingViewSet(viewsets.ModelViewSet):
    serializer_class = BusBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return BusBooking.objects.all().order_by("-created_at")
        return BusBooking.objects.filter(organizer=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def assign(self, request, pk=None):
        booking = transition(
            pk, BusBookingStatus.BUS_ASSIGNED, admin_user=request.user,
            assigned_provider_id=request.data.get("provider_id"),
            assigned_vehicle_id=request.data.get("vehicle_id"),
        )
        return Response(BusBookingSerializer(booking).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def set_status(self, request, pk=None):
        booking = transition(pk, request.data["status"], admin_user=request.user)
        return Response(BusBookingSerializer(booking).data)