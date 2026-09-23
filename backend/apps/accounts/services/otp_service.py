import hashlib
import secrets
from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError

OTP_TTL_SECONDS = 600
OTP_MAX_ATTEMPTS = 5
OTP_LENGTH = 6


def _hash(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


def _key(purpose: str, identifier: str) -> str:
    return f"otp:{purpose}:{identifier.strip().lower()}"


def _attempts_key(purpose: str, identifier: str) -> str:
    return f"otp_attempts:{purpose}:{identifier.strip().lower()}"


def generate_otp(purpose: str, identifier: str) -> str:
    """Generate, store (hashed), and return a numeric OTP."""
    code = "".join(secrets.choice("0123456789") for _ in range(OTP_LENGTH))
    cache.set(_key(purpose, identifier), _hash(code), timeout=OTP_TTL_SECONDS)
    cache.delete(_attempts_key(purpose, identifier))
    return code


def verify_otp(purpose: str, identifier: str, code: str) -> bool:
    """Verify and consume the OTP. Raises ValidationError on failure."""
    stored = cache.get(_key(purpose, identifier))
    if stored is None:
        raise ValidationError("Invalid or expired code")

    attempts = int(cache.get(_attempts_key(purpose, identifier)) or 0)
    if attempts >= OTP_MAX_ATTEMPTS:
        raise ValidationError("Invalid or expired code")

    if _hash(code) != stored:
        cache.set(_attempts_key(purpose, identifier), attempts + 1, timeout=OTP_TTL_SECONDS)
        raise ValidationError("Invalid or expired code")

    cache.delete(_key(purpose, identifier))
    cache.delete(_attempts_key(purpose, identifier))
    return True