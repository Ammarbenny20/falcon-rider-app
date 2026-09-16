import uuid
from django.db import models
from django.conf import settings


class ProviderType(models.TextChoices):
    INDIVIDUAL_PROVIDER = "INDIVIDUAL_PROVIDER", "Individual Provider"
    FLEET_OWNER = "FLEET_OWNER", "Fleet Owner"
    TRANSPORT_OPERATOR = "TRANSPORT_OPERATOR", "Transport Operator"
    BUS_OPERATOR = "BUS_OPERATOR", "Bus Operator"
    SHUTTLE_OPERATOR = "SHUTTLE_OPERATOR", "Shuttle Operator"


class ProviderStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    SUSPENDED = "SUSPENDED", "Suspended"
    REACTIVATED = "REACTIVATED", "Reactivated"


class VerificationStatus(models.TextChoices):
    NOT_STARTED = "NOT_STARTED", "Not Started"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    SUBMITTED = "SUBMITTED", "Submitted"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    CORRECTION_REQUIRED = "CORRECTION_REQUIRED", "Correction Required"
    RESUBMITTED = "RESUBMITTED", "Resubmitted"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"



class Provider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="provider_profile")
    provider_type = models.CharField(max_length=30, choices=ProviderType.choices)
    status = models.CharField(max_length=20, choices=ProviderStatus.choices, default=ProviderStatus.ACTIVE)
    is_online = models.BooleanField(default=False)
    current_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    location_updated_at = models.DateTimeField(null=True, blank=True)
    is_location_simulated = models.BooleanField(
        default=True, help_text="True until real device GPS integration replaces demo data"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "is_online"]),
            models.Index(fields=["provider_type"]),
        ]

    @property
    def is_eligible_to_go_online(self) -> bool:
        """Spec section 21 — all four conditions must hold."""
        verification = getattr(self, "verification", None)
        vehicle = self.vehicles.filter(is_primary=True).first()
        return bool(
            self.status == ProviderStatus.ACTIVE
            and verification
            and verification.status == VerificationStatus.APPROVED
            and vehicle
            and vehicle.status == "ACTIVE"
            and vehicle.verification_status == VerificationStatus.APPROVED
        )

    def eligibility_blockers(self) -> list[str]:
        blockers = []
        if self.status != ProviderStatus.ACTIVE:
            blockers.append("Provider account is not active.")
        verification = getattr(self, "verification", None)
        if not verification or verification.status != VerificationStatus.APPROVED:
            blockers.append("Provider verification is not approved.")
        vehicle = self.vehicles.filter(is_primary=True).first()
        if not vehicle:
            blockers.append("No primary vehicle on file.")
        elif vehicle.status != "ACTIVE" or vehicle.verification_status != VerificationStatus.APPROVED:
            blockers.append("Vehicle is not active/approved.")
        return blockers


class ProviderVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.OneToOneField(Provider, on_delete=models.CASCADE, related_name="verification")
    status = models.CharField(max_length=25, choices=VerificationStatus.choices, default=VerificationStatus.NOT_STARTED)
    documents = models.JSONField(default=dict, blank=True)
    correction_notes = models.TextField(blank=True)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_verifications"
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ProviderAvailability(models.Model):
    class Level(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        LIMITED = "LIMITED", "Limited"
        NEARLY_FULL = "NEARLY_FULL", "Nearly Full"
        FULL = "FULL", "Full"
        BUSY = "BUSY", "Busy"
        UNAVAILABLE = "UNAVAILABLE", "Unavailable"

    provider = models.OneToOneField(Provider, on_delete=models.CASCADE, related_name="availability")
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.UNAVAILABLE)
    seats_total = models.PositiveSmallIntegerField(null=True, blank=True)
    seats_booked = models.PositiveSmallIntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)