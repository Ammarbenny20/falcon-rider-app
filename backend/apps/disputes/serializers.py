from rest_framework import serializers

from .models import Dispute


class DisputeReadSerializer(serializers.ModelSerializer):
    reporter_id = serializers.UUIDField(source="reporter.id", read_only=True)
    reporter_email = serializers.EmailField(source="reporter.email", read_only=True)
    against_id = serializers.UUIDField(source="against.id", read_only=True, allow_null=True)
    against_email = serializers.EmailField(source="against.email", read_only=True, allow_null=True)
    booking_id = serializers.UUIDField(source="booking.id", read_only=True, allow_null=True)
    journey_id = serializers.UUIDField(source="journey.id", read_only=True, allow_null=True)
    assigned_to_email = serializers.EmailField(source="assigned_to.email", read_only=True, allow_null=True)

    class Meta:
        model = Dispute
        fields = [
            "id", "reporter_id", "reporter_email",
            "against_id", "against_email",
            "booking_id", "journey_id",
            "category", "subject", "description", "evidence",
            "status", "resolution", "resolution_notes",
            "assigned_to_email",
            "resolved_at", "created_at", "updated_at",
        ]
        read_only_fields = fields


class DisputeCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=[
        "PAYMENT", "DRIVER_BEHAVIOR", "PASSENGER_BEHAVIOR",
        "SAFETY", "LOST_ITEM", "OVERCHARGE", "NO_SHOW", "OTHER",
    ])
    subject = serializers.CharField(max_length=200)
    description = serializers.CharField()
    against_id = serializers.UUIDField(required=False, allow_null=True)
    booking_id = serializers.UUIDField(required=False, allow_null=True)
    journey_id = serializers.UUIDField(required=False, allow_null=True)
    evidence = serializers.ListField(required=False, default=list)
