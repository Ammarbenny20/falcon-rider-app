from rest_framework import serializers

from core.fields import LocationField

from .models import EmergencyContact, SosAlert, TripShare


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ["id", "name", "phone_number", "relationship", "created_at"]


class SosAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SosAlert
        fields = ["id", "journey", "location", "message", "resolved", "created_at"]


class TripShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripShare
        fields = ["id", "journey", "shared_with_phone", "share_token", "expires_at", "created_at"]
