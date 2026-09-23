from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsProvider

from .models import Vehicle
from .serializers import (
    VehicleReadSerializer, VehicleCreateSerializer, VehicleUpdateSerializer,
)


def _get_provider(request):
    return request.user.provider_profile


class VehicleListCreateView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = Vehicle.objects.filter(
            provider=_get_provider(request)
        ).order_by("-created_at")
        return Response({
            "count": qs.count(),
            "next": None,
            "previous": None,
            "results": VehicleReadSerializer(qs, many=True).data,
        })

    def post(self, request):
        serializer = VehicleCreateSerializer(
            data=request.data,
            context={"provider": _get_provider(request)},
        )
        serializer.is_valid(raise_exception=True)
        vehicle = serializer.save()
        return Response(
            VehicleReadSerializer(vehicle).data,
            status=status.HTTP_201_CREATED,
        )


class VehicleDetailView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        obj = get_object_or_404(Vehicle, pk=pk, provider=_get_provider(request))
        return Response(VehicleReadSerializer(obj).data)

    def patch(self, request, pk):
        obj = get_object_or_404(Vehicle, pk=pk, provider=_get_provider(request))
        serializer = VehicleUpdateSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(VehicleReadSerializer(obj).data)

    def delete(self, request, pk):
        obj = get_object_or_404(Vehicle, pk=pk, provider=_get_provider(request))
        # Soft delete if referenced by journey plans, hard delete otherwise
        if obj.journey_plans.exists():
            obj.is_active = False
            obj.save(update_fields=["is_active", "updated_at"])
            return Response({"detail": "Vehicle deactivated (referenced by plans)."}, status=200)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
