from rest_framework import serializers
from apps.bus_bookings.models import BusBooking


class BusBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusBooking
        fields = "__all__"
        read_only_fields = ["id", "organizer", "status", "payment_status", "created_at", "updated_at"]