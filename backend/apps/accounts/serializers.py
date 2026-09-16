from rest_framework import serializers
from apps.accounts.models import User


class RequestOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)
    role = serializers.ChoiceField(choices=User.Role.choices, required=False)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone_number", "full_name", "role", "status", "created_at"]
        read_only_fields = fields