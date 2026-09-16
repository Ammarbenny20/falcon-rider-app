from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.exceptions import ValidationError

from apps.providers.models import Provider
from apps.providers.serializers import ProviderSerializer, ProviderVerificationSerializer
from apps.providers.services import verification_service
from permissions.roles import IsProvider, IsAdminRole


class ProviderViewSet(viewsets.ModelViewSet):
    serializer_class = ProviderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Provider.objects.select_related("verification").all()
        return Provider.objects.filter(user=user)

    @action(detail=True, methods=["get"])
    def eligibility(self, request, pk=None):
        provider = self.get_object()
        return Response({
            "eligible": provider.is_eligible_to_go_online,
            "blockers": provider.eligibility_blockers(),
        })

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsProvider])
    def go_online(self, request, pk=None):
        provider = self.get_object()
        if provider.user_id != request.user.id:
            return Response({"detail": "Not your provider account."}, status=status.HTTP_403_FORBIDDEN)
        if not provider.is_eligible_to_go_online:
            return Response(
                {"detail": "Not eligible.", "blockers": provider.eligibility_blockers()},
                status=status.HTTP_400_BAD_REQUEST,
            )
        provider.is_online = True
        provider.save(update_fields=["is_online"])
        return Response(ProviderSerializer(provider).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsProvider])
    def go_offline(self, request, pk=None):
        provider = self.get_object()
        if provider.user_id != request.user.id:
            return Response({"detail": "Not your provider account."}, status=status.HTTP_403_FORBIDDEN)
        provider.is_online = False
        provider.save(update_fields=["is_online"])
        return Response(ProviderSerializer(provider).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsProvider])
    def update_location(self, request, pk=None):
        provider = self.get_object()
        if provider.user_id != request.user.id:
            return Response({"detail": "Not your provider account."}, status=status.HTTP_403_FORBIDDEN)
        provider.current_lat = request.data.get("lat")
        provider.current_lng = request.data.get("lng")
        provider.location_updated_at = timezone.now()
        provider.save(update_fields=["current_lat", "current_lng", "location_updated_at"])
        return Response({"detail": "Location updated."})

    # --- verification lifecycle ---

    @action(detail=True, methods=["post"], url_path="verification/submit",
            permission_classes=[IsAuthenticated, IsProvider])
    def submit_verification(self, request, pk=None):
        provider = self.get_object()
        verification = verification_service.submit_verification(provider, request.data.get("documents", {}))
        return Response(ProviderVerificationSerializer(verification).data)

    @action(detail=True, methods=["post"], url_path="verification/review",
            permission_classes=[IsAuthenticated, IsAdminRole])
    def review_verification(self, request, pk=None):
        provider = self.get_object()
        v = verification_service.start_review(provider.verification.id, request.user)
        return Response(ProviderVerificationSerializer(v).data)

    @action(detail=True, methods=["post"], url_path="verification/approve",
            permission_classes=[IsAuthenticated, IsAdminRole])
    def approve_verification(self, request, pk=None):
        provider = self.get_object()
        try:
            v = verification_service.approve(provider.verification.id, request.user)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_409_CONFLICT)
        return Response(ProviderVerificationSerializer(v).data)

    @action(detail=True, methods=["post"], url_path="verification/reject",
            permission_classes=[IsAuthenticated, IsAdminRole])
    def reject_verification(self, request, pk=None):
        provider = self.get_object()
        v = verification_service.reject(provider.verification.id, request.user, request.data.get("notes", ""))
        return Response(ProviderVerificationSerializer(v).data)

    @action(detail=True, methods=["post"], url_path="verification/request-correction",
            permission_classes=[IsAuthenticated, IsAdminRole])
    def request_correction(self, request, pk=None):
        provider = self.get_object()
        v = verification_service.request_correction(provider.verification.id, request.user, request.data.get("notes", ""))
        return Response(ProviderVerificationSerializer(v).data)