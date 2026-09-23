import uuid
from django.db import models


class BookingStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    CONFIRMED = "CONFIRMED", "Confirmed"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"
    NO_SHOW = "NO_SHOW", "No Show"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PAID = "PAID", "Paid"
    REFUNDED = "REFUNDED", "Refunded"


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match_proposal = models.OneToOneField(
        "matching.MatchProposal",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booking",
    )
    passenger = models.ForeignKey(
        "accounts.PassengerProfile",
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    journey_plan = models.ForeignKey(
        "journey_plans.JourneyPlan",
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    seats_booked = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
    )
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bookings_booking"
        indexes = [models.Index(fields=["status"])]

    def __str__(self):
        return f"Booking<{self.id}>"


class SharedCost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="shared_cost",
    )
    base_fare = models.DecimalField(max_digits=10, decimal_places=2)
    distance_cost = models.DecimalField(max_digits=10, decimal_places=2)
    time_cost = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="TZS")
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bookings_sharedcost"

    def __str__(self):
        return f"SharedCost<{self.id}>"