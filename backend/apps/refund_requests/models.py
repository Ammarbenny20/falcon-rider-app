import uuid
from django.db import models


class RefundRequestStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"


class RefundReason(models.TextChoices):
    DRIVER_NO_SHOW = "DRIVER_NO_SHOW", "Driver no-show"
    TRIP_NOT_COMPLETED = "TRIP_NOT_COMPLETED", "Trip not completed"
    OVERCHARGE = "OVERCHARGE", "Overcharge"
    DUPLICATE_CHARGE = "DUPLICATE_CHARGE", "Duplicate charge"
    SERVICE_ISSUE = "SERVICE_ISSUE", "Service issue"
    SAFETY_CONCERN = "SAFETY_CONCERN", "Safety concern"
    OTHER = "OTHER", "Other"


class RefundRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requested_by = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE,
        related_name="refund_requests",
    )
    booking = models.ForeignKey(
        "bookings.Booking", on_delete=models.CASCADE,
        related_name="refund_requests",
    )
    payment = models.ForeignKey(
        "payments.Payment", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="refund_requests",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="TZS")
    reason = models.CharField(max_length=30, choices=RefundReason.choices)
    description = models.TextField()
    evidence = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20, choices=RefundRequestStatus.choices,
        default=RefundRequestStatus.PENDING,
    )
    reviewed_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="refund_requests_reviewed",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "refund_requests_refundrequest"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["requested_by"]),
        ]

    def __str__(self):
        return f"RefundRequest<{self.id} {self.status}>"
