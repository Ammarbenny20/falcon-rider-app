from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsProvider

from .template_models import JourneyTemplate
from .template_serializers import (
    JourneyTemplateCreateSerializer, JourneyTemplateReadSerializer,
)


def _get_provider(request):
    return request.user.provider_profile


class JourneyTemplateListCreateView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = JourneyTemplate.objects.filter(provider=_get_provider(request)).order_by("-created_at")
        return Response(JourneyTemplateReadSerializer(qs, many=True).data)

    def post(self, request):
        serializer = JourneyTemplateCreateSerializer(
            data=request.data,
            context={"provider": _get_provider(request)},
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(JourneyTemplateReadSerializer(obj).data, status=status.HTTP_201_CREATED)


class JourneyTemplateDetailView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        obj = JourneyTemplate.objects.get(pk=pk, provider=_get_provider(request))
        return Response(JourneyTemplateReadSerializer(obj).data)

    def patch(self, request, pk):
        obj = JourneyTemplate.objects.get(pk=pk, provider=_get_provider(request))
        for field in ("name", "days_of_week", "departure_time", "total_seats",
                      "price_per_seat", "is_active"):
            if field in request.data:
                setattr(obj, field, request.data[field])
        obj.save()
        return Response(JourneyTemplateReadSerializer(obj).data)

    def delete(self, request, pk):
        obj = JourneyTemplate.objects.get(pk=pk, provider=_get_provider(request))
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
