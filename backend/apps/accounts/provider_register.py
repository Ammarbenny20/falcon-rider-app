"""
Provider registration endpoint.

Takes an existing User (role will be upgraded to PROVIDER) and creates
a ProviderProfile with optional Vehicle details in one atomic call.
"""
from django.db import transaction
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.vehicles.models import Vehicle

from .models import ProviderProfile, UserRole


class VehicleDetailsSerializer(serializers.Serializer):
    make = serializers.CharField(max_length=50)
    model = serializers.CharField(max_length=50)
    plate_number = serializers.CharField(max_length=20)
    color = serializers.CharField(max_length=30)
    capacity = serializers.IntegerField(min_value=1)
    year = serializers.IntegerField(required=False, allow_null=True)


class ProviderRegisterSerializer(serializers.Serializer):
    vehicle_type = serializers.ChoiceField(
        choices=["BODA", "BAJAI", "CAR", "VAN", "BUS"]
    )
    license_number = serializers.CharField(max_length=50, required=False, allow_blank=True)
    capabilities = serializers.ListField(
        child=serializers.ChoiceField(
            choices=["RIDE", "DELIVERY", "SHARED_RIDE",
                     "PROFESSIONAL_SERVICE", "COMMUNITY_JOURNEY"]
        ),
        required=False,
        default=list,
    )
    vehicle_details = VehicleDetailsSerializer(required=False)

    def validate(self, attrs):
        user = self.context["user"]

        # Already a provider?
        if hasattr(user, "provider_profile"):
            raise serializers.ValidationError(
                {"detail": "User is already registered as a provider."}
            )

        # Validate vehicle_type matches the vehicle capacity
        vd = attrs.get("vehicle_details")
        if vd:
            if attrs["vehicle_type"] in ("BODA", "BAJAI") and vd["capacity"] > 2:
                raise serializers.ValidationError(
                    {"vehicle_details": {"capacity": ["Boda/Bajaji capacity cannot exceed 2."]}}
                )
            # Plate uniqueness
            plate = vd["plate_number"]
            if Vehicle.objects.filter(license_plate=plate).exists():
                raise serializers.ValidationError(
                    {"vehicle_details": {"plate_number": ["This plate is already registered."]}}
                )
        return attrs

    @transaction.atomic
    def save(self):
        user = self.context["user"]
        vd = self.validated_data.get("vehicle_details")

        # Upgrade user to PROVIDER
        user.role = UserRole.PROVIDER
        user.save(update_fields=["role", "updated_at"])

        # Create ProviderProfile
        profile = ProviderProfile.objects.create(
            user=user,
            verification_status="PENDING_VERIFICATION",
            license_number=self.validated_data.get("license_number") or None,
            vehicle_type=self.validated_data["vehicle_type"],
            capabilities=self.validated_data.get("capabilities", []),
            capability_status={
                cap: "PENDING_REVIEW"
                for cap in self.validated_data.get("capabilities", [])
            },
        )

        # Create Vehicle if details were provided
        vehicle = None
        if vd:
            vehicle = Vehicle.objects.create(
                provider=profile,
                transport_type=self.validated_data["vehicle_type"],
                make=vd["make"],
                model=vd["model"],
                year=vd.get("year") or 2020,
                license_plate=vd["plate_number"],
                capacity=vd["capacity"],
                color=vd["color"],
                is_active=True,
            )

        return profile, vehicle


class ProviderRegisterView(APIView):
    """
    POST /api/v1/provider/register/
    Auth: YES (any authenticated user)
    Upgrades the current user to PROVIDER and creates ProviderProfile + Vehicle.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProviderRegisterSerializer(
            data=request.data,
            context={"user": request.user},
        )
        serializer.is_valid(raise_exception=True)
        profile, vehicle = serializer.save()

        return Response({
            "id": str(profile.id),
            "user": str(profile.user_id),
            "status": profile.verification_status,
            "capabilities": profile.capabilities,
            "vehicle": {
                "id": str(vehicle.id),
                "plate_number": vehicle.license_plate,
                "transport_type": vehicle.transport_type,
            } if vehicle else None,
            "created_at": profile.created_at.isoformat(),
        }, status=status.HTTP_201_CREATED)
