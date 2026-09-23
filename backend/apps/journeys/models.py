import uuid
from django.db import models
from django.db import models


class JourneyStatus(models.TextChoices):
    NOT_STARTED = "NOT_STARTED", "Not Started"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    ABORTED = "ABORTED", "Aborted"
    CANCELLED = "CANCELLED", "Cancelled"


class Journey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey_plan = models.OneToOneField("journey_plans.JourneyPlan", on_delete=models.CASCADE, related_name="journey")
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    current_location = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=JourneyStatus.choices, default=JourneyStatus.NOT_STARTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "journeys_journey"

    def __str__(self):
        return f"Journey<{self.id}>"

