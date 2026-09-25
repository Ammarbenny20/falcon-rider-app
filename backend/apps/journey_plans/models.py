import uuid
from django.db import models
from django.db import models


class JourneyType(models.TextChoices):
    PROFESSIONAL = "PROFESSIONAL", "Professional Service"
    COMMUNITY_JOURNEY = "COMMUNITY_JOURNEY", "Community Journey"

class GenderRestriction(models.TextChoices):
    ANY = "ANY", "Any"
    FEMALE_ONLY = "FEMALE_ONLY", "Female passengers only"
    MALE_ONLY = "MALE_ONLY", "Male passengers only"

class JourneyPlanStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PUBLISHED = "PUBLISHED", "Published"
    FULL = "FULL", "Full"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    ABORTED = "ABORTED", "Aborted"
    CANCELLED = "CANCELLED", "Cancelled"


class JourneyPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(
        "accounts.ProviderProfile", on_delete=models.CASCADE,
        related_name="journey_plans",
    )
    vehicle = models.ForeignKey(
        "vehicles.Vehicle", on_delete=models.PROTECT,
        related_name="journey_plans",
    )
    journey_type = models.CharField(
        max_length=30, choices=JourneyType.choices,
        default=JourneyType.PROFESSIONAL,
    )
    gender_restriction = models.CharField(
        max_length=20, choices=GenderRestriction.choices, 
        default=GenderRestriction.ANY,
    )
    origin = models.CharField(max_length=100, blank=True, null=True)
    origin_label = models.CharField(max_length=255)
    destination = models.CharField(max_length=100, blank=True, null=True)
    destination_label = models.CharField(max_length=255)
    planned_route = models.CharField(max_length=255, blank=True, null=True)
    scheduled_departure_time = models.DateTimeField()
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=JourneyPlanStatus.choices,
        default=JourneyPlanStatus.DRAFT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "journey_plans_journeyplan"
        indexes = [
            models.Index(fields=["status", "scheduled_departure_time"]),
            models.Index(fields=["journey_type"]),
        ]

    def __str__(self):
        return f"JourneyPlan<{self.id}>"

