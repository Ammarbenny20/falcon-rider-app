from rest_framework import serializers

from core.fields import LocationField

from .models import RiderRequest


class RiderRequestCreateSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label")
    destination = LocationField(label_field_name="destination_label")

    class Meta:
        model = RiderRequest
        fields = [
            "id", "origin", "destination", "requested_time",
            "scheduled_for", "is_scheduled",
            "seats_needed", "booking_type", "ride_access_type",
            "transport_mode", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate(self, attrs):
        is_scheduled = attrs.get("is_scheduled", False)
        booking_type = attrs.get("booking_type", "NOW")
        scheduled_for = attrs.get("scheduled_for")

        if booking_type == "SCHEDULED" and not scheduled_for:
            raise serializers.ValidationError(
                {"scheduled_for": ["This field is required for scheduled rides."]}
            )
        if booking_type == "NOW" and scheduled_for:
            # Clean it up silently â€” NOW rides don't need scheduled_for
            attrs["scheduled_for"] = None
        return attrs

    def create(self, validated_data):
        passenger = self.context["passenger"]
        origin_data = validated_data.pop("origin")
        dest_data = validated_data.pop("destination")
        origin_point = f"{origin_data['longitude']},{origin_data['latitude']}"
        dest_point = f"{dest_data['longitude']},{dest_data['latitude']}"

        # Set status based on booking_type
        booking_type = validated_data.get("booking_type", "NOW")
        status_value = "SUBMITTED" if booking_type == "NOW" else "SCHEDULED"

        return RiderRequest.objects.create(
            passenger=passenger,
            origin=origin_point,
            origin_label=origin_data.get("label") or "",
            destination=dest_point,
            destination_label=dest_data.get("label") or "",
            status=status_value,
            **validated_data,
        )


class RiderRequestReadSerializer(serializers.ModelSerializer):
    origin = LocationField(label_field_name="origin_label", read_only=True)
    destination = LocationField(label_field_name="destination_label", read_only=True)
    passenger_id = serializers.UUIDField(source="passenger.id", read_only=True)

    class Meta:
        model = RiderRequest
        fields = [
            "id", "passenger_id", "origin", "destination",
            "requested_time", "scheduled_for", "is_scheduled",
            "seats_needed", "booking_type", "ride_access_type",
            "transport_mode", "status", "created_at",
        ]


