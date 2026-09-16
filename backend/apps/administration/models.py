import uuid
from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="audit_actions")
    action = models.CharField(max_length=100)
    entity = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=64)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["entity", "entity_id"]),
            models.Index(fields=["action", "timestamp"]),
        ]
        ordering = ["-timestamp"]