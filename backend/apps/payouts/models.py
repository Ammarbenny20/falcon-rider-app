import uuid
from django.conf import settings
from django.db import models


class EarningStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    AVAILABLE = "AVAILABLE", "Available for payout"
    PAID_OUT = "PAID_OUT", "Paid out"
    CANCELLED = "CANCELLED", "Cancelled"


class ProviderEarning(models.Model):
    """One row per booking — how much the provider earned."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        "accounts.ProviderProfile", on_delete=models.CASCADE,
        related_name="earnings",
    )
    booking = models.OneToOneField(
        "bookings.Booking", on_delete=models.CASCADE,
        related_name="provider_earning",
    )
    journey_plan = models.ForeignKey(
        "journey_plans.JourneyPlan", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="provider_earnings",
    )
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="TZS")
    status = models.CharField(
        max_length=20, choices=EarningStatus.choices,
        default=EarningStatus.AVAILABLE,
    )
    payout = models.ForeignKey(
        "payouts.ProviderPayout", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="earnings",
    )
    earned_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "payouts_provider_earning"
        indexes = [
            models.Index(fields=["provider", "status"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Earning<{self.provider_id} {self.net_amount}>"


class PayoutStatus(models.TextChoices):
    PENDING = "PENDING", "Pending approval"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"
    PAID = "PAID", "Paid"
    CANCELLED = "CANCELLED", "Cancelled"


class ProviderPayout(models.Model):
    """A batch payout to a provider covering one or more earnings."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        "accounts.ProviderProfile", on_delete=models.CASCADE,
        related_name="payouts",
    )
    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="TZS")
    status = models.CharField(
        max_length=20, choices=PayoutStatus.choices,
        default=PayoutStatus.PENDING,
    )
    transaction_reference = models.CharField(max_length=100, null=True, blank=True)
    approved_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="payouts_approved",
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    rejected_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payouts_provider_payout"
        indexes = [
            models.Index(fields=["provider", "status"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Payout<{self.provider_id} {self.amount} {self.status}>"
