import uuid
from django.db import models


class DisputeCategory(models.TextChoices):
    PAYMENT = "PAYMENT", "Payment Issue"
    DRIVER_BEHAVIOR = "DRIVER_BEHAVIOR", "Driver Behavior"
    PASSENGER_BEHAVIOR = "PASSENGER_BEHAVIOR", "Passenger Behavior"
    SAFETY = "SAFETY", "Safety Concern"
    LOST_ITEM = "LOST_ITEM", "Lost Item"
    OVERCHARGE = "OVERCHARGE", "Overcharge"
    NO_SHOW = "NO_SHOW", "No Show"
    OTHER = "OTHER", "Other"


class DisputeStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    INVESTIGATING = "INVESTIGATING", "Investigating"
    RESOLVED = "RESOLVED", "Resolved"
    CLOSED = "CLOSED", "Closed"


class DisputeResolution(models.TextChoices):
    FAVOR_REPORTER = "FAVOR_REPORTER", "In favor of reporter"
    FAVOR_ACCUSED = "FAVOR_ACCUSED", "In favor of accused"
    PARTIAL = "PARTIAL", "Partially resolved"
    NO_FAULT = "NO_FAULT", "No fault found"


class Dispute(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE,
        related_name="disputes_filed",
    )
    against = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="disputes_against",
    )
    booking = models.ForeignKey(
        "bookings.Booking", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="disputes",
    )
    journey = models.ForeignKey(
        "journeys.Journey", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="disputes",
    )
    category = models.CharField(max_length=30, choices=DisputeCategory.choices)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    evidence = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20, choices=DisputeStatus.choices,
        default=DisputeStatus.OPEN,
    )
    resolution = models.CharField(
        max_length=30, choices=DisputeResolution.choices, null=True, blank=True,
    )
    resolution_notes = models.TextField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="disputes_assigned",
    )
    resolved_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="disputes_resolved",
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "disputes_dispute"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["reporter"]),
        ]

    def __str__(self):
        return f"Dispute<{self.id} {self.category} {self.status}>"
