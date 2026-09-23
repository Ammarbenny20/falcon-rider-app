from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    shared_cost_id = serializers.UUIDField(source="shared_cost.id", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id", "shared_cost_id", "amount", "method", "status",
            "transaction_reference", "initiated_at", "completed_at",
        ]
