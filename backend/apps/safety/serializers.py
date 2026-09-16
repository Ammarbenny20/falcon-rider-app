from rest_framework import serializers
from apps.safety.models import SafetyIncident, TrustedContact


class TrustedContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustedContact
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]


class SafetyIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyIncident
        fields = "__all__"
        read_only_fields = ["id", "reported_by", "passenger", "provider", "vehicle", "status", "created_at", "resolved_at"]