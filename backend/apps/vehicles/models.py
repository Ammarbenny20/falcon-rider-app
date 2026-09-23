import uuid
from django.db import models


class TransportType(models.TextChoices):
    BODA_BODA = "BODA_BODA", "Boda Boda"
    BAJAI = "BAJAI", "Bajaji"
    CAR = "CAR", "Car"
    BUS = "BUS", "Bus"


class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey("accounts.ProviderProfile", on_delete=models.CASCADE, related_name="vehicles")
    transport_type = models.CharField(max_length=20, choices=TransportType.choices)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    license_plate = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    color = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "vehicles_vehicle"

    def __str__(self):
        return f"{self.make} {self.model} ({self.license_plate})"
