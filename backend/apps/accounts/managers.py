from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, phone_number, full_name, password, **extra):
        if not email and not phone_number:
            raise ValidationError("At least one of email or phone_number is required.")
        if not full_name:
            raise ValidationError("full_name is required.")
        if not password:
            raise ValidationError("password is required.")

        email = self.normalize_email(email).lower() if email else None
        user = self.model(
            email=email,
            phone_number=phone_number or None,
            full_name=full_name,
            **extra,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, phone_number=None, full_name=None,
                    password=None, role="PASSENGER", **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(email, phone_number, full_name, password, role=role, **extra)

    def create_superuser(self, email, full_name, password, phone_number=None, **extra):
        extra.setdefault("role", "ADMIN")
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("is_verified", True)
        if extra.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, phone_number, full_name, password, **extra)