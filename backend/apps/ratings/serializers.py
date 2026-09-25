from rest_framework import serializers

from .models import Rating


class RatingCreateSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField()
    punctuality = serializers.BooleanField(required=False, allow_null=True)
    comfort = serializers.BooleanField(required=False, allow_null=True)
    cleanliness = serializers.BooleanField(required=False, allow_null=True)
    driving_safety = serializers.BooleanField(required=False, allow_null=True)
    comment = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class RatingReadSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(source="booking.id", read_only=True)
    rater_id = serializers.UUIDField(source="rater.id", read_only=True)
    ratee_id = serializers.UUIDField(source="ratee.id", read_only=True)

    class Meta:
        model = Rating
        fields = [
            "id", "booking_id", "rater_id", "ratee_id",
            "punctuality", "comfort", "cleanliness", "driving_safety",
            "comment", "created_at",
        ]
        read_only_fields = fields