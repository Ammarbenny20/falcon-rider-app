from rest_framework import serializers

from .models import RefundRequest


class RefundRequestReadSerializer(serializers.ModelSerializer):
    requested_by_email = serializers.EmailField(source="requested_by.email", read_only=True)
    reviewed_by_email = serializers.EmailField(source="reviewed_by.email", read_only=True, allow_null=True)
    booking_id = serializers.UUIDField(source="booking.id", read_only=True)
    payment_id = serializers.UUIDField(source="payment.id", read_only=True, allow_null=True)

    class Meta:
        model = RefundRequest
        fields = [
            "id", "requested_by_email", "booking_id", "payment_id",
            "amount", "currency", "reason", "description", "evidence",
            "status", "reviewed_by_email", "reviewed_at", "review_notes",
            "completed_at", "created_at", "updated_at",
        ]
        read_only_fields = fields


class RefundRequestCreateSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField()
    payment_id = serializers.UUIDField(required=False, allow_null=True)
    reason = serializers.ChoiceField(choices=[
        "DRIVER_NO_SHOW", "TRIP_NOT_COMPLETED", "OVERCHARGE",
        "DUPLICATE_CHARGE", "SERVICE_ISSUE", "SAFETY_CONCERN", "OTHER",
    ])
    description = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    evidence = serializers.ListField(required=False, default=list)
