from rest_framework import serializers
from apps.journeys.models import Journey


class JourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = "__all__"
        read_only_fields = [
            "id", "passenger", "provider", "vehicle", "status",
            "distance_meters", "pickup_eta_seconds",
            "travel_time_min_seconds", "travel_time_max_seconds",
            "estimated_arrival_at",
            "fare_amount", "platform_fee_amount", "provider_earning_amount",
            "payment_status",
            "requested_at", "accepted_at", "arrived_at", "started_at",
            "completed_at", "cancelled_at",
        ]


class JourneyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = [
            "id", "transport_type",
            "origin_lat", "origin_lng", "origin_label",
            "destination_lat", "destination_lng", "destination_label",
            "is_scheduled", "scheduled_for", "journey_plan",
        ]
        read_only_fields = ["id"]