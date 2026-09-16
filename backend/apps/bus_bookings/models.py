import uuid
from django.db import models
from django.conf import settings


class BusBookingStatus(models.TextChoices):
    REQUESTED = "REQUESTED", "Requested"
    REVIEWING = "REVIEWING", "Reviewing"
    BUS_ASSIGNED = "BUS_ASSIGNED", "Bus Assigned"
    CONFIRMED = "CONFIRMED", "Confirmed"
    READY_FOR_DEPARTURE = "READY_FOR_DEPARTURE", "Ready for Departure"
    VEHICLE_ARRIVING = "VEHICLE_ARRIVING", "Vehicle Arriving"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"
    NEEDS_ACTION = "NEEDS_ACTION", "Needs Action"

    


class BusBooking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="bus_bookings")
    contact_phone = models.CharField(max_length=20)
    organization_name = models.CharField(max_length=150, blank=True)

    pickup_label = models.CharField(max_length=255)
    pickup_lat = models.DecimalField(max_digits=10, decimal_places=7)
    pickup_lng = models.DecimalField(max_digits=10, decimal_places=7)
    destination_label = models.CharField(max_length=255)
    destination_lat = models.DecimalField(max_digits=10, decimal_places=7)
    destination_lng = models.DecimalField(max_digits=10, decimal_places=7)

    travel_date = models.DateField()
    departure_window_start = models.TimeField()
    departure_window_end = models.TimeField()
    passenger_count = models.PositiveIntegerField()
    is_return_journey = models.BooleanField(default=False)
    vehicle_type_requested = models.CharField(max_length=20, default="BUS")
    capacity_requested = models.PositiveIntegerField(null=True, blank=True)

    estimated_fare = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default="PENDING")
    status = models.CharField(max_length=25, choices=BusBookingStatus.choices, default=BusBookingStatus.REQUESTED)

    assigned_provider = models.ForeignKey(
        "providers.Provider", on_delete=models.SET_NULL, null=True, blank=True, related_name="bus_bookings"
    )
    assigned_vehicle = models.ForeignKey(
        "vehicles.Vehicle", on_delete=models.SET_NULL, null=True, blank=True, related_name="bus_bookings"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["status", "travel_date"])]