import uuid
from django.db import models
from django.db import models


class BookingType(models.TextChoices):
    """WHEN the ride happens (NOW vs SCHEDULED)."""
    NOW = "NOW", "Now"
    SCHEDULED = "SCHEDULED", "Scheduled"


class RideAccessType(models.TextChoices):
    """WHO is in the ride (shared vs whole-vehicle)."""
    SHARED = "SHARED", "Shared"
    PRIVATE = "PRIVATE", "Private"
    WHOLE_VEHICLE = "WHOLE_VEHICLE", "Whole Vehicle"


class TransportMode(models.TextChoices):
    BODA = "BODA", "Boda Boda"
    BAJAI = "BAJAI", "Bajaji"
    CAR = "CAR", "Car"
    VAN = "VAN", "Van"
    BUS = "BUS", "Bus"


class RiderRequestStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SUBMITTED = "SUBMITTED", "Submitted"
    SCHEDULED = "SCHEDULED", "Scheduled"
    AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION", "Awaiting Confirmation"
    CONFIRMED = "CONFIRMED", "Confirmed"
    MATCHING = "MATCHING", "Matching"
    MATCHED = "MATCHED", "Matched"
    BOOKED = "BOOKED", "Booked"
    FULFILLED = "FULFILLED", "Fulfilled"
    NO_MATCH_FOUND = "NO_MATCH_FOUND", "No Match Found"
    CANCELLED = "CANCELLED", "Cancelled"
    EXPIRED = "EXPIRED", "Expired"


class RiderRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passenger = models.ForeignKey(
        "accounts.PassengerProfile", on_delete=models.CASCADE,
        related_name="rider_requests",
    )
    origin = models.CharField(max_length=100, blank=True, null=True)
    origin_label = models.CharField(max_length=255)
    destination = models.CharField(max_length=100, blank=True, null=True)
    destination_label = models.CharField(max_length=255)
    requested_time = models.DateTimeField()
    scheduled_for = models.DateTimeField(null=True, blank=True)
    is_scheduled = models.BooleanField(default=False)
    seats_needed = models.PositiveIntegerField()
    booking_type = models.CharField(
        max_length=20, choices=BookingType.choices, default=BookingType.NOW,
    )
    ride_access_type = models.CharField(
        max_length=20, choices=RideAccessType.choices, default=RideAccessType.SHARED,
    )
    transport_mode = models.CharField(
        max_length=20, choices=TransportMode.choices, null=True, blank=True,
    )
    preferred_copassenger_gender = models.CharField(     # <-- NEW
        max_length=20, choices=CopassengerGenderPreference.choices,
        default=CopassengerGenderPreference.ANY,
    )
    status = models.CharField(...)
    status = models.CharField(
        max_length=30, choices=RiderRequestStatus.choices,
        default=RiderRequestStatus.SUBMITTED,
    )
    expires_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rider_requests_riderrequest"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["booking_type", "scheduled_for"]),
        ]

    def __str__(self):
        return f"RiderRequest<{self.id}>"

class CopassengerGenderPreference(models.TextChoices):
    ANY = "ANY", "Any"
    FEMALE_ONLY = "FEMALE_ONLY", "Female passengers only"
    MALE_ONLY = "MALE_ONLY", "Male passengers only"
