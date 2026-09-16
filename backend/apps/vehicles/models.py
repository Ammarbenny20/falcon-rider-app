import uuid
from django.db import models
from apps.providers.models import Provider, VerificationStatus


class VehicleStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    PENDING_VERIFICATION = "PENDING_VERIFICATION", "Pending Verification"
    SUSPENDED = "SUSPENDED", "Suspended"


class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        BODA_BODA = "BODA_BODA", "Boda Boda"
        BAJAJI = "BAJAJI", "Bajaji"
        CAR = "CAR", "Car"
        BUS = "BUS", "Bus"
        SHUTTLE = "SHUTTLE", "Shuttle"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="vehicles")
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
    plate_number = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=50, blank=True)
    model = models.CharField(max_length=50, blank=True)
    capacity = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(max_length=25, choices=VehicleStatus.choices, default=VehicleStatus.PENDING_VERIFICATION)
    verification_status = models.CharField(
        max_length=25, choices=VerificationStatus.choices, default=VerificationStatus.NOT_STARTED
    )
    is_primary = models.BooleanField(default=False)
    documents = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["provider", "status"])]
        constraints = [
            models.UniqueConstraint(
                fields=["provider"], condition=models.Q(is_primary=True),
                name="one_primary_vehicle_per_provider"
            )
        ]