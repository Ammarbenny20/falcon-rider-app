import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models

from .managers import UserManager


class UserRole(models.TextChoices):
    PASSENGER = "PASSENGER", "Passenger"
    PROVIDER = "PROVIDER", "Provider"
    ADMIN = "ADMIN", "Admin"


class UserStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    SUSPENDED = "SUSPENDED", "Suspended"
    DELETED = "DELETED", "Deleted"

class Gender(models.TextChoices):
    MALE = "MALE", "Male"
    FEMALE = "FEMALE", "Female"
    UNSPECIFIED = "UNSPECIFIED", "Prefer not to say"

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, unique=True, db_index=True, null=True, blank=True)
    full_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNSPECIFIED)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PASSENGER)
    status = models.CharField(max_length=20, choices=UserStatus.choices, default=UserStatus.ACTIVE)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "accounts_user"
        indexes = [models.Index(fields=["role", "status"])]

    def clean(self):
        super().clean()
        if not self.email and not self.phone_number:
            raise ValidationError("At least one of email or phone_number is required.")

    def __str__(self):
        return f"{self.email or self.phone_number} ({self.role})"

    @property
    def is_passenger(self):
        return self.role == UserRole.PASSENGER

    @property
    def is_provider(self):
        return self.role == UserRole.PROVIDER


class PassengerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="passenger_profile")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_journeys = models.IntegerField(default=0)
    default_payment_method_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_passenger_profile"

    def __str__(self):
        return f"PassengerProfile<{self.user_id}>"


class ProviderVerificationStatus(models.TextChoices):
    REGISTERED = "REGISTERED", "Registered"
    PENDING_VERIFICATION = "PENDING_VERIFICATION", "Pending Verification"
    VERIFIED = "VERIFIED", "Verified"
    REJECTED = "REJECTED", "Rejected"
    SUSPENDED = "SUSPENDED", "Suspended"
    DEACTIVATED = "DEACTIVATED", "Deactivated"


class ProfessionalAvailability(models.TextChoices):
    OFFLINE = "OFFLINE", "Offline"
    ONLINE = "ONLINE", "Online"
    BUSY = "BUSY", "Busy"


class CommunityAvailability(models.TextChoices):
    NOT_SHARING = "NOT_SHARING", "Not Sharing"
    JOURNEY_PUBLISHED = "JOURNEY_PUBLISHED", "Journey Published"
    MATCHING = "MATCHING", "Matching"
    LIVE = "LIVE", "Live"


class ProviderProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="provider_profile")

    professional_availability = models.CharField(
        max_length=20, choices=ProfessionalAvailability.choices,
        default=ProfessionalAvailability.OFFLINE,
    )
    community_availability = models.CharField(
        max_length=30, choices=CommunityAvailability.choices,
        default=CommunityAvailability.NOT_SHARING,
    )

    verification_status = models.CharField(
        max_length=30, choices=ProviderVerificationStatus.choices,
        default=ProviderVerificationStatus.REGISTERED,
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_journeys = models.IntegerField(default=0)
    license_number = models.CharField(max_length=50, null=True, blank=True)
    vehicle_type = models.CharField(
        max_length=20,
        choices=[
            ("BODA", "Boda Boda"),
            ("BAJAI", "Bajaji"),
            ("CAR", "Car"),
            ("VAN", "Van"),
            ("BUS", "Bus"),
        ],
        null=True, blank=True,
    )

    # Capability system — a provider can be approved for professional
    # service, community journey, or both.
    capabilities = models.JSONField(default=list, blank=True)
    capability_status = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "accounts_provider_profile"

    def __str__(self):
        return f"ProviderProfile<{self.user_id}>"



class ProviderDocumentType(models.TextChoices):
    LICENSE = "LICENSE", "Driver License"
    INSURANCE = "INSURANCE", "Insurance"
    VEHICLE_REGISTRATION = "VEHICLE_REGISTRATION", "Vehicle Registration"
    IDENTITY = "IDENTITY", "Identity Document"


class ProviderDocumentStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class ProviderDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        ProviderProfile, on_delete=models.CASCADE, related_name="documents",
    )
    document_type = models.CharField(
        max_length=30, choices=ProviderDocumentType.choices,
    )
    file = models.FileField(upload_to="provider_documents/")
    status = models.CharField(
        max_length=20, choices=ProviderDocumentStatus.choices,
        default=ProviderDocumentStatus.PENDING,
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="reviewed_documents",
    )
    rejection_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_provider_document"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["provider", "document_type"]),
        ]

    def __str__(self):
        return f"ProviderDocument<{self.provider_id} {self.document_type}>"


class PushPlatform(models.TextChoices):
    IOS = "ios", "iOS"
    ANDROID = "android", "Android"


class PushToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="push_tokens")
    token = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=10, choices=PushPlatform.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_push_token"
        indexes = [models.Index(fields=["user"])]

    def __str__(self):
        return f"PushToken<{self.user_id} {self.platform}>"


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=150)
    body = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_notification"
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"Notification<{self.user_id}>"
