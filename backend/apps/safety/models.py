import uuid
from django.db import models
from django.db import models


class EmergencyContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="emergency_contacts")
    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    relationship = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "safety_emergencycontact"


class SosAlert(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="sos_alerts")
    journey = models.ForeignKey("journeys.Journey", on_delete=models.SET_NULL, null=True, blank=True, related_name="sos_alerts")
    location = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(null=True, blank=True)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "safety_sosalert"


class TripShare(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey = models.ForeignKey("journeys.Journey", on_delete=models.CASCADE, related_name="trip_shares")
    shared_with_phone = models.CharField(max_length=20)
    share_token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "safety_tripshare"

