from rest_framework import serializers

from core.fields import LocationField

from .models import Journey


class JourneySerializer(serializers.ModelSerializer):
    journey_plan_id = serializers.UUIDField(source="journey_plan.id", read_only=True)

    class Meta:
        model = Journey
        fields = [
            "id", "journey_plan_id", "actual_start_time", "actual_end_time",
            "status", "created_at",
        ]
