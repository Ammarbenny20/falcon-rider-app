from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin, IsProvider

from .models import ProviderProfile
from .notifications_service import (
    notify_provider_verified, notify_provider_rejected,
)
from .serializers import ProviderProfileSerializer


class ProviderProfileDetailView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        profile = request.user.provider_profile
        return Response(ProviderProfileSerializer(profile).data)

    def patch(self, request):
        profile = request.user.provider_profile
        for f in ["license_number"]:
            if f in request.data:
                setattr(profile, f, request.data[f])
        profile.save()
        return Response(ProviderProfileSerializer(profile).data)


class ProviderSubmitVerificationView(APIView):
    permission_classes = [IsProvider]

    def post(self, request):
        profile = request.user.provider_profile
        if not profile.license_number:
            return Response(
                {"license_number": ["License number is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        profile.verification_status = "PENDING_VERIFICATION"
        profile.save(update_fields=["verification_status", "updated_at"])
        return Response(ProviderProfileSerializer(profile).data)


class AdminProviderApprovalView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, provider_id):
        try:
            profile = ProviderProfile.objects.get(pk=provider_id)
        except ProviderProfile.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

        action = request.data.get("action")
        if action not in ("approve", "reject", "suspend"):
            return Response(
                {"action": ["Must be approve/reject/suspend."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        mapping = {"approve": "VERIFIED", "reject": "REJECTED", "suspend": "SUSPENDED"}
        profile.verification_status = mapping[action]
        profile.save(update_fields=["verification_status", "updated_at"])
        try:
            if action == "approve":
                notify_provider_verified(profile)
            elif action == "reject":
                notify_provider_rejected(profile, request.data.get("reason", ""))
        except Exception:
            pass
        return Response(ProviderProfileSerializer(profile).data)


# -----------------------------------------------------------------------------
# Document upload & admin review
# -----------------------------------------------------------------------------
from rest_framework.parsers import MultiPartParser, FormParser  # noqa: E402

from .models import ProviderDocument  # noqa: E402
from .serializers import (  # noqa: E402
    ProviderDocumentSerializer,
    ProviderDocumentUploadSerializer,
    ProviderCapabilitiesUpdateSerializer,
    ProviderAvailabilityUpdateSerializer,
)


class ProviderDocumentListCreateView(APIView):
    permission_classes = [IsProvider]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        docs = ProviderDocument.objects.filter(provider=request.user.provider_profile)
        return Response(
            ProviderDocumentSerializer(docs, many=True, context={"request": request}).data
        )

    def post(self, request):
        serializer = ProviderDocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doc = ProviderDocument.objects.create(
            provider=request.user.provider_profile,
            document_type=serializer.validated_data["document_type"],
            file=serializer.validated_data["file"],
        )
        return Response(
            ProviderDocumentSerializer(doc, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ProviderDocumentDeleteView(APIView):
    permission_classes = [IsProvider]

    def delete(self, request, pk):
        try:
            doc = ProviderDocument.objects.get(
                pk=pk, provider=request.user.provider_profile
            )
        except ProviderDocument.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        doc.file.delete(save=False)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminProviderDocumentListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        status_filter = request.query_params.get("status")
        qs = ProviderDocument.objects.all().order_by("-created_at")
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        return Response(
            ProviderDocumentSerializer(qs, many=True, context={"request": request}).data
        )


class AdminProviderDocumentReviewView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            doc = ProviderDocument.objects.get(pk=pk)
        except ProviderDocument.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        action = request.data.get("action")
        if action not in ("approve", "reject"):
            return Response(
                {"action": ["Must be approve or reject."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from django.utils import timezone
        doc.status = "APPROVED" if action == "approve" else "REJECTED"
        doc.reviewed_at = timezone.now()
        doc.reviewed_by = request.user
        if action == "reject":
            doc.rejection_reason = request.data.get("reason", "") or ""
        doc.save(update_fields=["status", "reviewed_at", "reviewed_by", "rejection_reason"])
        return Response(ProviderDocumentSerializer(doc, context={"request": request}).data)


# -----------------------------------------------------------------------------
# Availability & capabilities
# -----------------------------------------------------------------------------
class ProviderAvailabilityUpdateView(APIView):
    permission_classes = [IsProvider]

    def patch(self, request):
        serializer = ProviderAvailabilityUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.provider_profile
        profile.professional_availability = serializer.validated_data["availability"]
        profile.save(update_fields=["professional_availability", "updated_at"])
        return Response({
            "professional_availability": profile.professional_availability,
            "community_availability": profile.community_availability,
        })


class ProviderCapabilitiesUpdateView(APIView):
    permission_classes = [IsProvider]

    def patch(self, request):
        serializer = ProviderCapabilitiesUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.provider_profile

        # Preserve existing statuses for capabilities already in the list.
        # New capabilities default to PENDING_REVIEW.
        existing_status = profile.capability_status or {}
        new_status = {}
        for cap in serializer.validated_data["capabilities"]:
            new_status[cap] = existing_status.get(cap, "PENDING_REVIEW")

        profile.capabilities = serializer.validated_data["capabilities"]
        profile.capability_status = new_status
        profile.save(update_fields=["capabilities", "capability_status", "updated_at"])

        return Response({
            "capabilities": profile.capabilities,
            "capability_status": profile.capability_status,
        })
