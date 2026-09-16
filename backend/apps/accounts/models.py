import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, phone_number, role, password=None, **extra):
        if not phone_number:
            raise ValueError("Phone number is required")
        user = self.model(phone_number=phone_number, role=role, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra):
        extra.setdefault("role", User.Role.ADMIN)
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(phone_number, extra.pop("role"), password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        PASSENGER = "PASSENGER", "Passenger"
        PROVIDER = "PROVIDER", "Provider"
        ADMIN = "ADMIN", "Admin"

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        SUSPENDED = "SUSPENDED", "Suspended"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20, unique=True, db_index=True)
    full_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["role"]

    class Meta:
        indexes = [models.Index(fields=["role", "status"])]

    def __str__(self):
        return f"{self.phone_number} ({self.role})"


class OTPCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20, db_index=True)
    code_hash = models.CharField(max_length=128)
    purpose = models.CharField(max_length=30, default="LOGIN")
    expires_at = models.DateTimeField()
    consumed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["phone_number", "purpose"])]