"""
Payment gateway service layer.

Currently stub implementations that mirror what real gateways would do.
Webhook validation uses HMAC-SHA256 with a shared secret.
"""
import hashlib
import hmac
import json
from django.conf import settings
from django.utils import timezone

from apps.accounts.notifications_service import (
    notify_payment_successful, notify_payment_failed,
)

from .models import Payment


def generate_gateway_reference(method: str) -> str:
    import uuid
    return f"{method}-{uuid.uuid4().hex[:10].upper()}"


def verify_webhook_signature(payload: dict, signature: str) -> bool:
    """Verify HMAC-SHA256 signature using PAYMENT_WEBHOOK_SECRET."""
    secret = getattr(settings, "PAYMENT_WEBHOOK_SECRET", "dev-webhook-secret").encode()
    body = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")


def process_webhook(payload: dict) -> dict:
    """
    Expected payload:
        {
          "transaction_reference": "MPESA-ABC123",
          "status": "SUCCESS" | "FAILED",
          "gateway_response": {...}
        }
    """
    ref = payload.get("transaction_reference")
    new_status = payload.get("status", "").upper()

    try:
        payment = Payment.objects.get(transaction_reference=ref)
    except Payment.DoesNotExist:
        return {"ok": False, "error": "unknown_reference"}

    if new_status == "SUCCESS":
        payment.status = "SUCCESS"
        payment.completed_at = timezone.now()
        sc = payment.shared_cost
        sc.payment_status = "PAID"
        sc.save(update_fields=["payment_status"])
        try:
            notify_payment_successful(payment)
        except Exception:
            pass
    elif new_status == "FAILED":
        payment.status = "FAILED"
        payment.completed_at = timezone.now()
        try:
            notify_payment_failed(payment)
        except Exception:
            pass

    payment.gateway_response = payload.get("gateway_response", {})
    payment.save(update_fields=["status", "completed_at", "gateway_response"])

    return {"ok": True, "payment_id": str(payment.id), "status": payment.status}
