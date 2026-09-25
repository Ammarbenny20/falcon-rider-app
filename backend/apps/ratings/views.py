from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bookings.models import Booking

from .models import Rating
from .serializers import RatingCreateSerializer, RatingReadSerializer


class RateBookingView(APIView):
    """POST /api/v1/ratings/ — passenger rates the provider for a booking, once."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RatingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        booking = get_object_or_404(
            Booking, pk=d["booking_id"], passenger__user=request.user,
        )

        if booking.status not in ("CONFIRMED", "COMPLETED"):
            return Response(
                {"detail": f"Booking is {booking.status}; cannot rate yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Rating.objects.filter(booking=booking).exists():
            return Response(
                {"detail": "This booking has already been rated."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        rating = Rating.objects.create(
            booking=booking,
            rater=request.user,
            ratee=booking.journey_plan.provider.user,
            punctuality=d.get("punctuality"),
            comfort=d.get("comfort"),
            cleanliness=d.get("cleanliness"),
            driving_safety=d.get("driving_safety"),
            comment=d.get("comment") or "",
        )
        return Response(RatingReadSerializer(rating).data, status=status.HTTP_201_CREATED)


class MyRatingsGivenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Rating.objects.filter(rater=request.user).order_by("-created_at")
        return Response(RatingReadSerializer(qs, many=True).data)


class ProviderRatingSummaryView(APIView):
    """GET /api/v1/providers/{user_id}/ratings/summary/ — % Good per category."""
    permission_classes = [IsAuthenticated]

    def get(self, request, provider_user_id):
        qs = Rating.objects.filter(ratee_id=provider_user_id)

        def pct_good(field):
            answered = qs.exclude(**{field: None})
            n = answered.count()
            if n == 0:
                return None
            good = answered.filter(**{field: True}).count()
            return round((good / n) * 100, 1)

        return Response({
            "provider_user_id": str(provider_user_id),
            "total_ratings": qs.count(),
            "punctuality_good_pct": pct_good("punctuality"),
            "comfort_good_pct": pct_good("comfort"),
            "cleanliness_good_pct": pct_good("cleanliness"),
            "driving_safety_good_pct": pct_good("driving_safety"),
        })