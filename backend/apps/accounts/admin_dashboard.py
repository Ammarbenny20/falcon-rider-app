"""
Command Center endpoints — aggregate views for the admin dashboard.
These are optimized for auto-refresh (lightweight queries, minimal payloads).
"""
from datetime import timedelta
from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin

from apps.bookings.models import Booking, SharedCost
from apps.journey_plans.models import JourneyPlan
from apps.journeys.models import Journey
from apps.payments.models import Payment
from apps.rider_requests.models import RiderRequest
from apps.safety.models import SosAlert

from .models import ProviderProfile, User


class DashboardOverviewView(APIView):
    """One aggregate call returning everything the Command Center needs."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        last_24h = now - timedelta(hours=24)

        # Live operations
        active_trips = Journey.objects.filter(status="IN_PROGRESS").count()
        providers_online = ProviderProfile.objects.filter(
            professional_availability="ONLINE"
        ).count()
        providers_busy = ProviderProfile.objects.filter(
            professional_availability="BUSY"
        ).count()
        providers_available = max(0, providers_online - providers_busy)
        requests_searching = RiderRequest.objects.filter(status="MATCHING").count()
        requests_matched = RiderRequest.objects.filter(status="MATCHED").count()
        active_journeys = JourneyPlan.objects.filter(
            journey_type="COMMUNITY_JOURNEY", status="PUBLISHED"
        ).count()
        available_seats = (
            JourneyPlan.objects.filter(status="PUBLISHED")
            .aggregate(total=Sum("available_seats"))["total"] or 0
        )

        # Key metrics (24h)
        completed_trips_24h = Journey.objects.filter(
            status="COMPLETED", actual_end_time__gte=last_24h
        ).count()
        revenue_24h = (
            SharedCost.objects.filter(
                payment_status="PAID", created_at__gte=last_24h
            ).aggregate(total=Sum("total_amount"))["total"] or 0
        )
        new_users_24h = User.objects.filter(created_at__gte=last_24h).count()

        return Response({
            "live_operations": {
                "active_trips": active_trips,
                "providers_online": providers_online,
                "providers_available": providers_available,
                "requests_searching": requests_searching,
                "requests_matched": requests_matched,
                "active_journeys": active_journeys,
                "available_seats": available_seats,
            },
            "key_metrics": {
                "completed_trips_24h": completed_trips_24h,
                "revenue_24h": str(revenue_24h),
                "currency": "TZS",
                "new_users_24h": new_users_24h,
            },
            "action_items_count": (
                ProviderProfile.objects.filter(
                    verification_status__in=["REGISTERED", "PENDING_VERIFICATION"]
                ).count()
                + SosAlert.objects.filter(resolved=False).count()
            ),
            "activity_count_24h": _activity_count(last_24h),
            "map_marker_count": active_trips + providers_online,
            "last_updated": now.isoformat(),
        })


class LiveStatsView(APIView):
    """Lightweight endpoint for 15s auto-refresh polling."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        return Response({
            "active_trips": Journey.objects.filter(status="IN_PROGRESS").count(),
            "providers_online": ProviderProfile.objects.filter(
                professional_availability="ONLINE"
            ).count(),
            "providers_busy": ProviderProfile.objects.filter(
                professional_availability="BUSY"
            ).count(),
            "requests_searching": RiderRequest.objects.filter(status="MATCHING").count(),
            "requests_matched": RiderRequest.objects.filter(status="MATCHED").count(),
            "active_journeys": JourneyPlan.objects.filter(
                journey_type="COMMUNITY_JOURNEY", status="PUBLISHED"
            ).count(),
            "available_seats": (
                JourneyPlan.objects.filter(status="PUBLISHED")
                .aggregate(total=Sum("available_seats"))["total"] or 0
            ),
            "unresolved_sos": SosAlert.objects.filter(resolved=False).count(),
            "last_updated": now.isoformat(),
        })


class ActionCenterView(APIView):
    """Action items requiring admin intervention."""
    permission_classes = [IsAdmin]

    def get(self, request):
        items = []

        # Pending provider verifications
        pending = ProviderProfile.objects.filter(
            verification_status__in=["REGISTERED", "PENDING_VERIFICATION"]
        ).select_related("user").order_by("created_at")[:20]

        for p in pending:
            hours_waiting = (timezone.now() - p.created_at).total_seconds() / 3600
            priority = "CRITICAL" if hours_waiting > 48 else "HIGH" if hours_waiting > 12 else "NORMAL"
            items.append({
                "id": f"provider-{p.id}",
                "category": "PROVIDER_VERIFICATION",
                "priority": priority,
                "title": f"Provider verification pending: {p.user.full_name}",
                "description": f"Waiting {int(hours_waiting)}h",
                "entity_type": "PROVIDER",
                "entity_id": str(p.id),
                "created_at": p.created_at.isoformat(),
            })

        # Unresolved SOS alerts
        sos_alerts = SosAlert.objects.filter(resolved=False).select_related("user").order_by("-created_at")[:20]
        for s in sos_alerts:
            items.append({
                "id": f"sos-{s.id}",
                "category": "SOS_ALERT",
                "priority": "CRITICAL",
                "title": f"SOS from {s.user.full_name if s.user else 'unknown'}",
                "description": s.message or "",
                "entity_type": "SOS",
                "entity_id": str(s.id),
                "created_at": s.created_at.isoformat(),
            })

        return Response({
            "count": len(items),
            "items": items,
        })


class ActivityFeedView(APIView):
    """Recent activity events. Reuses audit log data."""
    permission_classes = [IsAdmin]

    def get(self, request):
        from core.audit import AuditLog
        try:
            limit = min(int(request.query_params.get("limit", 50)), 200)
        except ValueError:
            limit = 50

        logs = AuditLog.objects.select_related("user").order_by("-created_at")[:limit]
        events = []
        for log in logs:
            events.append({
                "id": str(log.id),
                "type": log.action,
                "user_email": log.user.email if log.user else None,
                "target_type": log.target_type,
                "target_id": log.target_id,
                "metadata": log.metadata,
                "created_at": log.created_at.isoformat(),
            })

        return Response({
            "count": len(events),
            "events": events,
        })


class LiveMapView(APIView):
    """Live markers: active journeys (with current location) + online providers."""
    permission_classes = [IsAdmin]

    def get(self, request):
        markers = []

        # Active journeys with a current location
        active = Journey.objects.filter(
            status="IN_PROGRESS",
            current_location__isnull=False,
        ).select_related("journey_plan")[:200]

        for j in active:
            markers.append({
                "id": f"journey-{j.id}",
                "type": "JOURNEY",
                "lat": j.current_location.y,
                "lng": j.current_location.x,
                "status": "IN_PROGRESS",
                "entity_id": str(j.id),
                "updated_at": j.updated_at.isoformat(),
            })

        return Response({
            "count": len(markers),
            "markers": markers,
            "last_updated": timezone.now().isoformat(),
        })


def _activity_count(since):
    """Helper: count audit log entries since a timestamp."""
    try:
        from core.audit import AuditLog
        return AuditLog.objects.filter(created_at__gte=since).count()
    except Exception:
        return 0
