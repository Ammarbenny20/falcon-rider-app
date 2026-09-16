from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.safety.models import SafetyIncident, TrustedContact
from apps.safety.serializers import SafetyIncidentSerializer, TrustedContactSerializer
from permissions.roles import IsAdminRole


class TrustedContactViewSet(viewsets.ModelViewSet):
    serializer_class = TrustedContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrustedContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SafetyIncidentViewSet(viewsets.ModelViewSet):
    serializer_class = SafetyIncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return SafetyIncident.objects.all().order_by("-created_at")
        return SafetyIncident.objects.filter(reported_by=user).order_by("-created_at")

    def perform_create(self, serializer):
        journey = serializer.validated_data["journey"]
        serializer.save(
            reported_by=self.request.user,
            passenger=journey.passenger,
            provider=journey.provider,
            vehicle=journey.vehicle,
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def resolve(self, request, pk=None):
        incident = self.get_object()
        incident.status = SafetyIncident.Status.RESOLVED
        incident.resolution_notes = request.data.get("notes", "")
        incident.resolved_at = timezone.now()
        incident.save(update_fields=["status", "resolution_notes", "resolved_at"])
        return Response(SafetyIncidentSerializer(incident).data)