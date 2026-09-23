from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import log_action
from core.permissions import IsAdmin

from apps.accounts.models import ProviderDocument
from apps.journey_plans.models import JourneyPlan
from apps.journey_plans.template_models import JourneyTemplate
from apps.vehicles.models import Vehicle


def _paginate(request, qs):
    try:
        page = int(request.query_params.get("page", 1))
        size = min(int(request.query_params.get("page_size", 20)), 100)
    except ValueError:
        page, size = 1, 20
    total = qs.count()
    items = qs[(page - 1) * size : page * size]
    return total, page, size, items


# =============================================================================
# Verification Queue
# =============================================================================
def _ser_doc(d):
    return {
        "id": str(d.id),
        "provider_id": str(d.provider.id),
        "provider_email": d.provider.user.email,
        "provider_name": d.provider.user.full_name,
        "document_type": d.document_type,
        "status": d.status,
        "reviewed_at": d.reviewed_at.isoformat() if d.reviewed_at else None,
        "rejection_reason": d.rejection_reason,
        "created_at": d.created_at.isoformat(),
    }


class AdminVerificationQueueView(APIView):
    """Docs awaiting review, grouped by provider."""
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = ProviderDocument.objects.filter(
            status="PENDING",
        ).select_related("provider__user").order_by("provider_id", "created_at")

        # Group by provider
        grouped = {}
        for d in qs:
            key = str(d.provider_id)
            grouped.setdefault(key, {
                "provider_id": key,
                "provider_email": d.provider.user.email,
                "provider_name": d.provider.user.full_name,
                "provider_verification_status": d.provider.verification_status,
                "documents": [],
            })
            grouped[key]["documents"].append(_ser_doc(d))

        return Response({
            "count": len(grouped),
            "results": list(grouped.values()),
        })


class AdminVerificationDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        doc = get_object_or_404(ProviderDocument, pk=pk)
        return Response(_ser_doc(doc))


class AdminVerificationApproveView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        doc = get_object_or_404(ProviderDocument, pk=pk)
        doc.status = "APPROVED"
        doc.reviewed_at = timezone.now()
        doc.reviewed_by = request.user
        doc.save(update_fields=["status", "reviewed_at", "reviewed_by"])

        log_action(
            user=request.user,
            action="admin.verification.approve",
            target_type="ProviderDocument",
            target_id=doc.id,
            request=request,
        )
        return Response(_ser_doc(doc))


class AdminVerificationRejectView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        doc = get_object_or_404(ProviderDocument, pk=pk)
        doc.status = "REJECTED"
        doc.reviewed_at = timezone.now()
        doc.reviewed_by = request.user
        doc.rejection_reason = request.data.get("reason", "") or ""
        doc.save(update_fields=["status", "reviewed_at", "reviewed_by", "rejection_reason"])

        log_action(
            user=request.user,
            action="admin.verification.reject",
            target_type="ProviderDocument",
            target_id=doc.id,
            metadata={"reason": doc.rejection_reason},
            request=request,
        )
        return Response(_ser_doc(doc))


# =============================================================================
# Vehicles Admin
# =============================================================================
def _ser_vehicle(v):
    return {
        "id": str(v.id),
        "provider_id": str(v.provider.id),
        "provider_email": v.provider.user.email,
        "provider_name": v.provider.user.full_name,
        "transport_type": v.transport_type,
        "make": v.make,
        "model": v.model,
        "year": v.year,
        "license_plate": v.license_plate,
        "capacity": v.capacity,
        "color": v.color,
        "is_active": v.is_active,
        "created_at": v.created_at.isoformat(),
        "updated_at": v.updated_at.isoformat(),
    }


class AdminVehicleListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Vehicle.objects.select_related("provider__user").order_by("-created_at")

        # Filters
        is_active = request.query_params.get("is_active")
        transport_type = request.query_params.get("transport_type")
        provider_id = request.query_params.get("provider_id")
        if is_active is not None and is_active != "":
            qs = qs.filter(is_active=is_active.lower() == "true")
        if transport_type:
            qs = qs.filter(transport_type=transport_type.upper())
        if provider_id:
            qs = qs.filter(provider_id=provider_id)

        total, page, size, items = _paginate(request, qs)
        return Response({
            "count": total,
            "page": page,
            "page_size": size,
            "results": [_ser_vehicle(v) for v in items],
        })


class AdminVehicleDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        v = get_object_or_404(Vehicle, pk=pk)
        return Response(_ser_vehicle(v))


# =============================================================================
# Community Journeys Admin
# =============================================================================
def _ser_journey_plan(p):
    return {
        "id": str(p.id),
        "provider_id": str(p.provider.id),
        "provider_email": p.provider.user.email,
        "provider_name": p.provider.user.full_name,
        "vehicle_id": str(p.vehicle.id),
        "journey_type": p.journey_type,
        "origin": {"latitude": p.origin.y, "longitude": p.origin.x, "label": p.origin_label},
        "destination": {"latitude": p.destination.y, "longitude": p.destination.x, "label": p.destination_label},
        "scheduled_departure_time": p.scheduled_departure_time.isoformat(),
        "total_seats": p.total_seats,
        "available_seats": p.available_seats,
        "price_per_seat": str(p.price_per_seat),
        "status": p.status,
        "created_at": p.created_at.isoformat(),
    }


class AdminJourneyListView(APIView):
    """Community journeys only."""
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = JourneyPlan.objects.filter(
            journey_type="COMMUNITY_JOURNEY",
        ).select_related("provider__user", "vehicle").order_by("-created_at")

        s = request.query_params.get("status")
        if s:
            qs = qs.filter(status=s.upper())

        total, page, size, items = _paginate(request, qs)
        return Response({
            "count": total,
            "page": page,
            "page_size": size,
            "results": [_ser_journey_plan(p) for p in items],
        })


class AdminJourneyDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        p = get_object_or_404(JourneyPlan, pk=pk, journey_type="COMMUNITY_JOURNEY")
        return Response(_ser_journey_plan(p))


class AdminJourneyTemplateListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = JourneyTemplate.objects.select_related(
            "provider__user", "vehicle",
        ).order_by("-created_at")

        is_active = request.query_params.get("is_active")
        if is_active is not None and is_active != "":
            qs = qs.filter(is_active=is_active.lower() == "true")

        total, page, size, items = _paginate(request, qs)
        return Response({
            "count": total,
            "page": page,
            "page_size": size,
            "results": [
                {
                    "id": str(t.id),
                    "provider_id": str(t.provider.id),
                    "provider_email": t.provider.user.email,
                    "vehicle_id": str(t.vehicle.id),
                    "name": t.name,
                    "origin": {"latitude": t.origin.y, "longitude": t.origin.x, "label": t.origin_label},
                    "destination": {"latitude": t.destination.y, "longitude": t.destination.x, "label": t.destination_label},
                    "days_of_week": t.days_of_week,
                    "departure_time": t.departure_time.isoformat(),
                    "total_seats": t.total_seats,
                    "is_active": t.is_active,
                    "created_at": t.created_at.isoformat(),
                }
                for t in items
            ],
        })


class AdminJourneyInstanceListView(APIView):
    """JourneyPlans that were auto-generated from templates (all journey types)."""
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = JourneyPlan.objects.select_related(
            "provider__user", "vehicle",
        ).order_by("-created_at")

        total, page, size, items = _paginate(request, qs)
        return Response({
            "count": total,
            "page": page,
            "page_size": size,
            "results": [_ser_journey_plan(p) for p in items],
        })
