from rest_framework import serializers

from .models import Vehicle


class VehicleReadSerializer(serializers.ModelSerializer):
    provider_id = serializers.UUIDField(source="provider.id", read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            "id", "provider_id", "transport_type", "make", "model",
            "year", "license_plate", "capacity", "color",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = fields


class VehicleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "transport_type", "make", "model", "year",
            "license_plate", "capacity", "color", "is_active",
        ]

    def validate_license_plate(self, value):
        if not value:
            raise serializers.ValidationError("License plate is required.")
        if Vehicle.objects.filter(license_plate=value).exists():
            raise serializers.ValidationError("Vehicle with this plate already exists.")
        return value.upper().strip()

    def validate_capacity(self, value):
        if value < 1 or value > 60:
            raise serializers.ValidationError("Capacity must be between 1 and 60.")
        return value

    def create(self, validated_data):
        provider = self.context["provider"]
        return Vehicle.objects.create(provider=provider, **validated_data)


class VehicleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["make", "model", "year", "capacity", "color", "is_active"]

    def validate_capacity(self, value):
        if value < 1 or value > 60:
            raise serializers.ValidationError("Capacity must be between 1 and 60.")
        return value
