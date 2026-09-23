from rest_framework import serializers

from apps.vehicles.models import Vehicle
from core.fields import LocationField

from .template_models import JourneyTemplate


class JourneyTemplateReadSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label", read_only=True)
    destination = LocationField(label_field_name="destination_label", read_only=True)
    provider_id = serializers.UUIDField(source="provider.id", read_only=True)
    vehicle_id = serializers.UUIDField(source="vehicle.id", read_only=True)

    class Meta:
        model = JourneyTemplate
        fields = [
            "id", "provider_id", "vehicle_id", "name",
            "origin", "destination", "days_of_week", "departure_time",
            "total_seats", "price_per_seat", "is_active",
            "created_at", "updated_at",
        ]


class JourneyTemplateCreateSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label")
    destination = LocationField(label_field_name="destination_label")
    vehicle_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = JourneyTemplate
        fields = [
            "id", "vehicle_id", "name", "origin", "destination",
            "days_of_week", "departure_time", "total_seats",
            "price_per_seat", "is_active",
        ]
        read_only_fields = ["id"]

    def validate_days_of_week(self, value):
        if not value:
            raise serializers.ValidationError("At least one day is required.")
        for d in value:
            if not isinstance(d, int) or d < 1 or d > 7:
                raise serializers.ValidationError("Days must be 1-7 (Mon=1..Sun=7).")
        return sorted(set(value))

    def validate_vehicle_id(self, value):
        provider = self.context["provider"]
        try:
            return Vehicle.objects.get(pk=value, provider=provider, is_active=True)
        except Vehicle.DoesNotExist:
            raise serializers.ValidationError("Vehicle not found or not yours.")

    def create(self, validated_data):
        provider = self.context["provider"]
        origin = validated_data.pop("origin")
        dest = validated_data.pop("destination")
        vehicle = validated_data.pop("vehicle_id")

        return JourneyTemplate.objects.create(
            provider=provider,
            vehicle=vehicle,
            origin=f"{origin['longitude']},{origin['latitude']}",
            origin_label=origin.get("label") or "",
            destination=f"{dest['longitude']},{dest['latitude']}",
            destination_label=dest.get("label") or "",
            **validated_data,
        )


