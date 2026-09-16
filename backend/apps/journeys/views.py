from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError, PermissionDenied

from apps.journeys.models import Journey
from apps.journeys.serializers import JourneySerializer, JourneyCreateSerializer
from apps.journeys.services import journey_service
from permissions.roles import IsPassenger, IsProvider, IsJourneyOwnerPassenger, IsJourneyOwnerProvider


class JourneyViewSet(viewsets.ModelViewSet):
    serializer_class = JourneySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "transport_type", "payment_status"]

    def get_queryset(self):
        user = self.request.user
        # Role-scoped visibility — admins see all, others see only their own.
        if user.role == "ADMIN":
            return Journey.objects.all().order_by("-requested_at")
        if user.role == "PROVIDER":
            provider = getattr(user, "provider_profile", None)
            return Journey.objects.filter(provider=provider).order_by("-requested_at")
        return Journey.objects.filter(passenger=user).order_by("-requested_at")

    def get_serializer_class(self):
        if self.action == "create":
            return JourneyCreateSerializer
        return JourneySerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsPassenger()]
        if self.action in ("accept", "arrive", "start", "complete"):
            return [IsAuthenticated(), IsProvider()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(passenger=self.request.user)

    def _handle(self, service_fn, request, pk):
        provider = getattr(request.user, "provider_profile", None)
        if provider is None:
            return Response({"detail": "No provider profile."}, status=status.HTTP_403_FORBIDDEN)
        try:
            journey = service_fn(pk, provider)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_409_CONFLICT)
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        return Response(JourneySerializer(journey).data)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        return self._handle(journey_service.accept_journey, request, pk)

    @action(detail=True, methods=["post"])
    def arrive(self, request, pk=None):
        return self._handle(journey_service.mark_arrived, request, pk)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        return self._handle(journey_service.start_journey, request, pk)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        return self._handle(journey_service.complete_journey, request, pk)

        from rest_framework.views import APIView
from apps.journeys.services.fare_service import get_quotes


class JourneyQuoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        origin = request.data["origin"]
        destination = request.data["destination"]
        quotes = get_quotes(
            (float(origin["lat"]), float(origin["lng"])),
            (float(destination["lat"]), float(destination["lng"])),
        )
        return Response([q.__dict__ for q in quotes])