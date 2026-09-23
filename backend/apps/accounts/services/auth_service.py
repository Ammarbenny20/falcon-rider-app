from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Q

from apps.accounts.models import User


def resolve_user_by_identifier(identifier: str):
    """Look up by email (case-insensitive) OR phone (exact). Returns None if not found."""
    if not identifier:
        return None
    identifier = identifier.strip()
    return (
        User.objects
        .filter(Q(email__iexact=identifier) | Q(phone_number=identifier))
        .first()
    )


def authenticate_credentials(identifier: str, password: str):
    """
    Returns (user, error_code).
    error_code ∈ {None, "invalid_credentials", "suspended"}.
    """
    user = resolve_user_by_identifier(identifier)
    if user is None:
        # Constant-time-ish: run a dummy hash so timing doesn't reveal existence
        make_password(password)
        return None, "invalid_credentials"

    if not user.check_password(password):
        return None, "invalid_credentials"

    if not user.is_active or user.status == "SUSPENDED":
        return None, "suspended"

    if user.status == "DELETED":
        return None, "invalid_credentials"

    return user, None