from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsPassenger
from apps.accounts.notifications_service import notify_booking_cancelled

from apps.journey_plans.models import JourneyPlan

from .models import Booking, SharedCost
from .serializers import BookingCreateSerializer, BookingReadSerializer, SharedCostSerializer


def _get_passenger(request):
    return request.user.passenger_profile


class BookingListCreateView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request):
        qs = Booking.objects.filter(passenger=_get_passenger(request)).order_by("-created_at")
        data = BookingReadSerializer(qs, many=True).data
        return Response({"count": len(data), "next": None, "previous": None, "results": data})

    def post(self, request):
        serializer = BookingCreateSerializer(
            data=request.data,
            context={"passenger": _get_passenger(request)},
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingReadSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingDetailView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request, pk):
        obj = get_object_or_404(Booking, pk=pk, passenger=_get_passenger(request))
        return Response(BookingReadSerializer(obj).data)


class BookingCancelView(APIView):
    permission_classes = [IsPassenger]

    def post(self, request, pk):
        with transaction.atomic():
            booking = get_object_or_404(
                Booking.objects.select_for_update(),
                pk=pk,
                passenger=_get_passenger(request),
            )

            if booking.status in ("CANCELLED", "COMPLETED", "NO_SHOW"):
                return Response(
                    {"detail": f"Booking is {booking.status}, cannot cancel."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            plan = JourneyPlan.objects.select_for_update().get(pk=booking.journey_plan_id)
            plan.available_seats = plan.available_seats + booking.seats_booked
            if plan.status == "FULL" and plan.available_seats > 0:
                plan.status = "PUBLISHED"
            plan.save(update_fields=["available_seats", "status", "updated_at"])

            booking.status = "CANCELLED"
            booking.cancelled_at = timezone.now()
            booking.cancel_reason = request.data.get("reason", "") or ""
            booking.save(update_fields=["status", "cancelled_at", "cancel_reason", "updated_at"])

        # Notify (best-effort)
        try:
            notify_booking_cancelled(booking)
        except Exception:
            pass

        return Response(BookingReadSerializer(booking).data)


class BookingCostView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, passenger=_get_passenger(request))
        cost = get_object_or_404(SharedCost, booking=booking)
        return Response(SharedCostSerializer(cost).data)
