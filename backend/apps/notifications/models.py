import uuid
from django.db import models
from django.conf import settings


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=150)
    body = models.TextField()
    category = models.CharField(max_length=50)  # e.g. JOURNEY_MATCHED, PAYMENT_UPDATE, VERIFICATION_UPDATE
    related_entity = models.CharField(max_length=50, blank=True)
    related_entity_id = models.CharField(max_length=64, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["recipient", "is_read"])]
        ordering = ["-created_at"]