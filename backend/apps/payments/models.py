import uuid
from django.db import models
from django.conf import settings


class PaymentMethod(models.TextChoices):
    CASH = "CASH", "Cash"
    MOBILE_MONEY = "MOBILE_MONEY", "Mobile Money"
    CARD = "CARD", "Card"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    SUCCESSFUL = "SUCCESSFUL", "Successful"
    FAILED = "FAILED", "Failed"
    REFUNDED = "REFUNDED", "Refunded"


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey = models.OneToOneField("journeys.Journey", on_delete=models.CASCADE, related_name="payment")
    passenger = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="payments")
    provider = models.ForeignKey("providers.Provider", on_delete=models.PROTECT, related_name="payments")

    fare_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider_earning_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_percent_applied = models.DecimalField(max_digits=5, decimal_places=2)

    method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    external_reference = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    settled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["provider", "status"]),
        ]