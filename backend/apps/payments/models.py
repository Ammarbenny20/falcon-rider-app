import uuid
from django.db import models


class PaymentMethod(models.TextChoices):
    MPESA = "MPESA", "M-PESA"
    TIGO_PESA = "TIGO_PESA", "Tigo Pesa"
    AIRTEL_MONEY = "AIRTEL_MONEY", "Airtel Money"
    CASH = "CASH", "Cash"
    CARD = "CARD", "Card"


class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED", "Initiated"
    SUCCESS = "SUCCESS", "Success"
    FAILED = "FAILED", "Failed"
    REFUNDED = "REFUNDED", "Refunded"


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shared_cost = models.ForeignKey("bookings.SharedCost", on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED)
    transaction_reference = models.CharField(max_length=100, unique=True)
    gateway_response = models.JSONField(default=dict)
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments_payment"

    def __str__(self):
        return f"Payment<{self.transaction_reference}>"
