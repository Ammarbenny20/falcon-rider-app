from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count

from permissions.roles import IsAdminRole
from apps.accounts.models import User
from apps.providers.models import Provider, VerificationStatus
from apps.vehicles.models import Vehicle, VehicleStatus
from apps.journeys.models import Journey, JourneyStatus
from apps.payments.models import Payment, PaymentStatus
from apps.safety.models import SafetyIncident
from apps.support.models import SupportTicket
from apps.bus_bookings.models import BusBooking


class AdminOverviewView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        today_revenue = (
            Payment.objects.filter(status=PaymentStatus.SUCCESSFUL, settled_at__gte=today_start)
            .aggregate(total=Sum("platform_fee_amount"))["total"] or 0
        )

        return Response({
            "total_users": User.objects.count(),
            "active_commuters": User.objects.filter(role=User.Role.PASSENGER, status="ACTIVE").count(),
            "registered_providers": Provider.objects.count(),
            "verified_providers": Provider.objects.filter(
                verification__status=VerificationStatus.APPROVED
            ).count(),
            "providers_online": Provider.objects.filter(is_online=True).count(),
            "active_journeys": Journey.objects.exclude(
                status__in=[JourneyStatus.COMPLETED, JourneyStatus.CANCELLED]
            ).count(),
            "completed_journeys": Journey.objects.filter(status=JourneyStatus.COMPLETED).count(),
            "todays_journeys": Journey.objects.filter(requested_at__gte=today_start).count(),
            "todays_revenue": today_revenue,
            "alerts": {
                "providers_awaiting_verification": Provider.objects.filter(
                    verification__status__in=[VerificationStatus.SUBMITTED, VerificationStatus.RESUBMITTED]
                ).count(),
                "vehicles_awaiting_verification": Vehicle.objects.filter(
                    status=VehicleStatus.PENDING_VERIFICATION
                ).count(),
                "safety_incidents": SafetyIncident.objects.exclude(status="RESOLVED").count(),
                "failed_payments": Payment.objects.filter(status=PaymentStatus.FAILED).count(),
                "cancelled_journeys": Journey.objects.filter(status=JourneyStatus.CANCELLED).count(),
                "open_support_tickets": SupportTicket.objects.exclude(status__in=["RESOLVED", "CLOSED"]).count(),
                "bus_bookings_needing_action": BusBooking.objects.filter(status="NEEDS_ACTION").count(),
            },
        }) 
        from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from permissions.roles import IsAdminRole


class AdminUserViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]
    queryset = User.objects.all().order_by("-created_at")
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["role", "status"]

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.status = User.Status.SUSPENDED
        user.is_active = False
        user.save(update_fields=["status", "is_active"])
        self._audit(request.user, "USER_SUSPENDED", user)
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=["post"])
    def reactivate(self, request, pk=None):
        user = self.get_object()
        user.status = User.Status.ACTIVE
        user.is_active = True
        user.save(update_fields=["status", "is_active"])
        self._audit(request.user, "USER_REACTIVATED", user)
        return Response(UserSerializer(user).data)

    def _audit(self, admin_user, action_name, target_user):
        from apps.administration.models import AuditLog
        AuditLog.objects.create(
            actor=admin_user, action=action_name, entity="User", entity_id=str(target_user.id)
        class LiveOperationsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        active = Journey.objects.exclude(
            status__in=[JourneyStatus.COMPLETED, JourneyStatus.CANCELLED, JourneyStatus.SEARCHING]
        ).select_related("provider", "passenger", "vehicle")

        results = []
        for journey in active:
            provider = journey.provider
            results.append({
                "journey_id": str(journey.id),
                "passenger_name": journey.passenger.full_name or journey.passenger.phone_number,
                "provider_id": str(provider.id) if provider else None,
                "vehicle_plate": journey.vehicle.plate_number if journey.vehicle else None,
                "origin_label": journey.origin_label,
                "destination_label": journey.destination_label,
                "status": journey.status,
                "pickup_eta_seconds": journey.pickup_eta_seconds,
                "estimated_arrival_at": journey.estimated_arrival_at,
                "payment_status": journey.payment_status,
                "provider_position": {
                    "lat": float(provider.current_lat) if provider and provider.current_lat else None,
                    "lng": float(provider.current_lng) if provider and provider.current_lng else None,
                    # Explicit, honest label — never claim real GPS until it's real.
                    "is_simulated": provider.is_location_simulated if provider else True,
                } if provider else None,
            })
        return Response(results)
        )