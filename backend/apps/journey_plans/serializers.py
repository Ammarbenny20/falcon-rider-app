from rest_framework import serializers

from apps.vehicles.models import Vehicle
from core.fields import LocationField

from .models import JourneyPlan


class JourneyPlanReadSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label", read_only=True)
    destination = LocationField(label_field_name="destination_label", read_only=True)
    provider_id = serializers.UUIDField(source="provider.id", read_only=True)
    vehicle_id = serializers.UUIDField(source="vehicle.id", read_only=True)

    class Meta:
        model = JourneyPlan
        fields = [
            "id", "provider_id", "vehicle_id", "origin", "destination",
            "scheduled_departure_time", "total_seats", "available_seats",
            "price_per_seat", "gender_restriction","status", "created_at",
        ]


class JourneyPlanCreateSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label")
    destination = LocationField(label_field_name="destination_label")
    vehicle_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = JourneyPlan
        fields = [
            "id", "vehicle_id", "origin", "destination",
            "scheduled_departure_time", "total_seats", "price_per_seat",
            "gender_restriction", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_vehicle_id(self, value):
        provider = self.context["provider"]
        try:
            return Vehicle.objects.get(pk=value, provider=provider, is_active=True)
        except Vehicle.DoesNotExist:
            raise serializers.ValidationError("Vehicle not found or not yours.")

    def create(self, validated_data):
        provider = self.context["provider"]
        origin_data = validated_data.pop("origin")
        dest_data = validated_data.pop("destination")
        vehicle = validated_data.pop("vehicle_id")
        total_seats = validated_data["total_seats"]

        return JourneyPlan.objects.create(
            provider=provider,
            vehicle=vehicle,
            origin=f"{origin_data['longitude']},{origin_data['latitude']}",
            origin_label=origin_data["label"] or "",
            destination=f"{dest_data['longitude']},{dest_data['latitude']}",
            destination_label=dest_data["label"] or "",
            available_seats=total_seats,
            status="PUBLISHED",
            **validated_data,
        )



