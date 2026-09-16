import uuid
from django.db import models
from django.conf import settings


class TransportType(models.TextChoices):
    BODA_BODA = "BODA_BODA", "Boda Boda"
    BAJAJI = "BAJAJI", "Bajaji"
    CAR = "CAR", "Car"
    BUS = "BUS", "Bus"


class JourneyStatus(models.TextChoices):
    SEARCHING = "SEARCHING", "Searching"
    MATCHING = "MATCHING", "Matching"
    CONFIRMED = "CONFIRMED", "Confirmed"
    PROVIDER_ARRIVING = "PROVIDER_ARRIVING", "Provider Arriving"
    PROVIDER_ARRIVED = "PROVIDER_ARRIVED", "Provider Arrived"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"




class Journey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passenger = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="journeys_as_passenger"
    )
    provider = models.ForeignKey(
        "providers.Provider", on_delete=models.PROTECT, null=True, blank=True, related_name="journeys"
    )
    vehicle = models.ForeignKey(
        "vehicles.Vehicle", on_delete=models.PROTECT, null=True, blank=True
    )
    transport_type = models.CharField(max_length=20, choices=TransportType.choices)
    status = models.CharField(
        max_length=25, choices=JourneyStatus.choices, default=JourneyStatus.SEARCHING, db_index=True
    )

    origin_lat = models.DecimalField(max_digits=10, decimal_places=7)
    origin_lng = models.DecimalField(max_digits=10, decimal_places=7)
    origin_label = models.CharField(max_length=255)
    destination_lat = models.DecimalField(max_digits=10, decimal_places=7)
    destination_lng = models.DecimalField(max_digits=10, decimal_places=7)
    destination_label = models.CharField(max_length=255)

    distance_meters = models.PositiveIntegerField(null=True, blank=True)
    pickup_eta_seconds = models.PositiveIntegerField(null=True, blank=True)
    travel_time_min_seconds = models.PositiveIntegerField(null=True, blank=True)
    travel_time_max_seconds = models.PositiveIntegerField(null=True, blank=True)
    estimated_arrival_at = models.DateTimeField(null=True, blank=True)

    fare_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    platform_fee_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    provider_earning_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default="PENDING")

    is_scheduled = models.BooleanField(default=False)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    journey_plan = models.ForeignKey(
        "journeys.JourneyPlan", on_delete=models.SET_NULL, null=True, blank=True, related_name="journeys"
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "transport_type"]),
            models.Index(fields=["passenger", "status"]),
            models.Index(fields=["provider", "status"]),
        ]

    def __str__(self):
        return f"Journey {self.id} [{self.status}]"


class JourneyPlan(models.Model):
    """Recurring journey foundation — spec section 52."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passenger = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="journey_plans")
    origin_label = models.CharField(max_length=255)
    origin_lat = models.DecimalField(max_digits=10, decimal_places=7)
    origin_lng = models.DecimalField(max_digits=10, decimal_places=7)
    destination_label = models.CharField(max_length=255)
    destination_lat = models.DecimalField(max_digits=10, decimal_places=7)
    destination_lng = models.DecimalField(max_digits=10, decimal_places=7)
    transport_type = models.CharField(max_length=20, choices=TransportType.choices)
    days_of_week = models.CharField(max_length=20, help_text="e.g. MON,TUE,WED,THU,FRI")
    window_start_time = models.TimeField()
    window_end_time = models.TimeField()
    reminder_minutes_before = models.PositiveSmallIntegerField(default=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)