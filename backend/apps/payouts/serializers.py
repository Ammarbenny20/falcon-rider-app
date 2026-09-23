from rest_framework import serializers

from .models import ProviderEarning, ProviderPayout


class ProviderEarningSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(source="booking.id", read_only=True)
    provider_id = serializers.UUIDField(source="provider.id", read_only=True)

    class Meta:
        model = ProviderEarning
        fields = [
            "id", "provider_id", "booking_id", "journey_plan",
            "gross_amount", "platform_fee", "net_amount", "currency",
            "status", "payout", "earned_at",
        ]
        read_only_fields = fields


class ProviderPayoutSerializer(serializers.ModelSerializer):
    provider_id = serializers.UUIDField(source="provider.id", read_only=True)
    provider_email = serializers.EmailField(source="provider.user.email", read_only=True)
    provider_name = serializers.CharField(source="provider.user.full_name", read_only=True)
    approved_by_email = serializers.EmailField(source="approved_by.email", read_only=True, allow_null=True)

    class Meta:
        model = ProviderPayout
        fields = [
            "id", "provider_id", "provider_email", "provider_name",
            "period_start", "period_end", "amount", "currency",
            "status", "transaction_reference",
            "approved_by_email", "approved_at", "paid_at",
            "rejected_reason", "created_at", "updated_at",
        ]
        read_only_fields = fields


class GeneratePayoutsSerializer(serializers.Serializer):
    provider_id = serializers.UUIDField(required=False, allow_null=True)
    period_start = serializers.DateTimeField(required=False, allow_null=True)
    period_end = serializers.DateTimeField(required=False, allow_null=True)
