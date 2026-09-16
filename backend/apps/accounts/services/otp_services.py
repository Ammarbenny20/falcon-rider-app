import hashlib
import random
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.accounts.models import OTPCode

OTP_TTL_MINUTES = 5
MAX_ATTEMPTS = 5


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


def request_otp(phone_number: str, purpose: str = "LOGIN") -> None:
    code = f"{random.randint(0, 999999):06d}"
    OTPCode.objects.create(
        phone_number=phone_number,
        code_hash=_hash_code(code),
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    # SMS_API_KEY-backed provider goes here later (spec section 74/82).
    # For now, send via configured SMS gateway abstraction:
    from apps.notifications.services.sms_service import send_sms
    send_sms(phone_number, f"Falcon Rider code: {code}")


def verify_otp(phone_number: str, code: str, purpose: str = "LOGIN") -> bool:
    otp = (
        OTPCode.objects.filter(phone_number=phone_number, purpose=purpose, consumed_at__isnull=True)
        .order_by("-created_at")
        .first()
    )
    if not otp:
        raise ValidationError("No pending code for this number.")
    if otp.expires_at < timezone.now():
        raise ValidationError("Code expired.")
    if otp.attempts >= MAX_ATTEMPTS:
        raise ValidationError("Too many attempts. Request a new code.")

    otp.attempts += 1
    otp.save(update_fields=["attempts"])

    if otp.code_hash != _hash_code(code):
        raise ValidationError("Incorrect code.")

    otp.consumed_at = timezone.now()
    otp.save(update_fields=["consumed_at"])
    return True