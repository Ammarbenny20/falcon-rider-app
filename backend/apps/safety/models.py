import uuid
from django.db import models
from django.conf import settings


class TrustedContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="trusted_contacts")
    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)


class SafetyIncident(models.Model):
    class Status(models.TextChoices):
        REPORTED = "REPORTED", "Reported"
        INVESTIGATING = "INVESTIGATING", "Investigating"
        ACTION_TAKEN = "ACTION_TAKEN", "Action Taken"
        RESOLVED = "RESOLVED", "Resolved"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey = models.ForeignKey("journeys.Journey", on_delete=models.CASCADE, related_name="safety_incidents")
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="reported_incidents")
    passenger = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+", null=True)
    provider = models.ForeignKey("providers.Provider", on_delete=models.SET_NULL, null=True, related_name="+")
    vehicle = models.ForeignKey("vehicles.Vehicle", on_delete=models.SET_NULL, null=True, related_name="+")

    category = models.CharField(max_length=50)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REPORTED)
    resolution_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["status", "created_at"])]