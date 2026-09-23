import re
from django.core.exceptions import ValidationError


class ComplexityValidator:
    """Require at least one uppercase, one lowercase, and one digit."""

    def validate(self, password, user=None):
        if not re.search(r"[A-Z]", password):
            raise ValidationError(
                "Password must contain at least one uppercase letter.",
                code="password_no_upper",
            )
        if not re.search(r"[a-z]", password):
            raise ValidationError(
                "Password must contain at least one lowercase letter.",
                code="password_no_lower",
            )
        if not re.search(r"\d", password):
            raise ValidationError(
                "Password must contain at least one number.",
                code="password_no_number",
            )

    def get_help_text(self):
        return "Password must be at least 8 characters and contain uppercase, lowercase, and a number."