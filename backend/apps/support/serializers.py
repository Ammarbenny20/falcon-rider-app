from rest_framework import serializers
from apps.support.models import SupportTicket, SupportMessage


class SupportMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportMessage
        fields = "__all__"
        read_only_fields = ["id", "ticket", "author", "created_at"]


class SupportTicketSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = "__all__"
        read_only_fields = ["id", "user", "status", "assigned_admin", "created_at", "updated_at"]