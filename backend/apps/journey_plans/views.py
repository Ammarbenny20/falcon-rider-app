from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsProvider

from .models import JourneyPlan
from .serializers import JourneyPlanCreateSerializer, JourneyPlanReadSerializer


def _get_provider(request):
    return request.user.provider_profile


class JourneyPlanListCreateView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = JourneyPlan.objects.filter(
            provider=_get_provider(request)
        ).order_by("-created_at")
        data = JourneyPlanReadSerializer(qs, many=True).data
        return Response({"count": len(data), "next": None, "previous": None, "results": data})

    def post(self, request):
        serializer = JourneyPlanCreateSerializer(
            data=request.data,
            context={"provider": _get_provider(request)},
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            JourneyPlanReadSerializer(instance).data,
            status=status.HTTP_201_CREATED,
        )


class JourneyPlanDetailView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request)
        )
        return Response(JourneyPlanReadSerializer(obj).data)

    def patch(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request)
        )
        if obj.status in ("COMPLETED", "ABORTED", "CANCELLED"):
            return Response(
                {"detail": f"Plan is {obj.status}, cannot modify."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        for field in ("total_seats", "available_seats", "price_per_seat", "status"):
            if field in request.data:
                setattr(obj, field, request.data[field])
        obj.save()
        return Response(JourneyPlanReadSerializer(obj).data)


class JourneyPlanCancelView(APIView):
    permission_classes = [IsProvider]

    def post(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request)
        )
        if obj.status in ("COMPLETED", "CANCELLED"):
            return Response(
                {"detail": f"Plan is {obj.status}, cannot cancel."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        obj.status = "CANCELLED"
        obj.save(update_fields=["status", "updated_at"])
        return Response(JourneyPlanReadSerializer(obj).data)


class JourneyPlanBookingsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        from apps.bookings.serializers import BookingReadSerializer

        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request)
        )
        bookings = obj.bookings.all().order_by("-created_at")
        return Response(BookingReadSerializer(bookings, many=True).data)
