from rest_framework import serializers

from apps.journey_plans.serializers import JourneyPlanReadSerializer

from .models import MatchProposal


class MatchProposalSerializer(serializers.ModelSerializer):
    rider_request_id = serializers.UUIDField(source="rider_request.id", read_only=True)
    journey_plan_id = serializers.UUIDField(source="journey_plan.id", read_only=True)
    journey_plan = JourneyPlanReadSerializer(read_only=True)

    class Meta:
        model = MatchProposal
        fields = [
            "id", "rider_request_id", "journey_plan_id",
            "match_score", "proposed_fare_share", "proposed_pickup_time",
            "status", "expires_at", "journey_plan",
        ]
