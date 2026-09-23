"""
Lightweight audit log. Records state-changing operations.

Kept in `core` because it's cross-cutting (any app can write to it).
"""
import uuid

from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=100, blank=True)
    target_id = models.CharField(max_length=64, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    request_id = models.CharField(max_length=64, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "core_audit_log"
        indexes = [
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["action", "created_at"]),
        ]

    def __str__(self):
        return f"AuditLog<{self.action} {self.target_type}:{self.target_id}>"


def log_action(user, action, target_type="", target_id="", metadata=None, request=None):
    """Record an audit event. Never raises — logging must not break flows."""
    try:
        ip = None
        request_id = ""
        if request is not None:
            ip = (
                request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
                or request.META.get("REMOTE_ADDR")
            )
            request_id = getattr(request, "request_id", "")
        AuditLog.objects.create(
            user=user if getattr(user, "is_authenticated", False) else None,
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id else "",
            metadata=metadata or {},
            request_id=request_id,
            ip_address=ip or None,
        )
    except Exception:
        pass
