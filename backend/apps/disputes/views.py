from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.audit import log_action
from core.permissions import IsAdmin

from apps.accounts.models import User
from apps.bookings.models import Booking
from apps.journeys.models import Journey

from .models import Dispute, DisputeStatus
from .serializers import DisputeCreateSerializer, DisputeReadSerializer
from .notifications import (
    notify_dispute_filed, notify_dispute_status_changed, notify_dispute_resolved,
)


def _paginate(request, qs):
    try:
        page = int(request.query_params.get("page", 1))
        size = min(int(request.query_params.get("page_size", 20)), 100)
    except ValueError:
        page, size = 1, 20
    total = qs.count()
    items = qs[(page - 1) * size : page * size]
    return {
        "count": total, "page": page, "page_size": size,
        "results": DisputeReadSerializer(items, many=True).data,
    }


class FileDisputeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DisputeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        against = None
        if d.get("against_id"):
            against = get_object_or_404(User, pk=d["against_id"])

        booking = None
        if d.get("booking_id"):
            booking = get_object_or_404(Booking, pk=d["booking_id"])

        journey = None
        if d.get("journey_id"):
            journey = get_object_or_404(Journey, pk=d["journey_id"])

        dispute = Dispute.objects.create(
            reporter=request.user,
            against=against,
            booking=booking,
            journey=journey,
            category=d["category"],
            subject=d["subject"],
            description=d["description"],
            evidence=d.get("evidence", []),
        )

        try:
            notify_dispute_filed(dispute)
        except Exception:
            pass

        log_action(
            user=request.user,
            action="dispute.filed",
            target_type="Dispute",
            target_id=dispute.id,
            metadata={"category": dispute.category},
            request=request,
        )

        return Response(
            DisputeReadSerializer(dispute).data,
            status=status.HTTP_201_CREATED,
        )


class MyDisputesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Dispute.objects.filter(reporter=request.user).order_by("-created_at")
        return Response(_paginate(request, qs))


class AdminDisputeListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Dispute.objects.all().select_related("reporter", "against").order_by("-created_at")

        status_filter = request.query_params.get("status")
        category = request.query_params.get("category")
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        if category:
            qs = qs.filter(category=category.upper())

        return Response(_paginate(request, qs))


class AdminDisputeDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        dispute = get_object_or_404(Dispute, pk=pk)
        return Response(DisputeReadSerializer(dispute).data)


class AdminDisputeActionView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk, action):
        dispute = get_object_or_404(Dispute, pk=pk)

        if action == "investigate":
            dispute.status = DisputeStatus.INVESTIGATING
            dispute.save(update_fields=["status", "updated_at"])
            try:
                notify_dispute_status_changed(dispute)
            except Exception:
                pass

        elif action == "assign":
            assignee_id = request.data.get("assignee_id")
            if not assignee_id:
                return Response({"assignee_id": ["Required."]}, status=400)
            assignee = get_object_or_404(User, pk=assignee_id, role="ADMIN")
            dispute.assigned_to = assignee
            dispute.save(update_fields=["assigned_to", "updated_at"])

        elif action == "resolve":
            resolution = (request.data.get("resolution") or "").upper()
            if resolution not in ("FAVOR_REPORTER", "FAVOR_ACCUSED", "PARTIAL", "NO_FAULT"):
                return Response(
                    {"resolution": ["Must be FAVOR_REPORTER, FAVOR_ACCUSED, PARTIAL, or NO_FAULT."]},
                    status=400,
                )
            dispute.status = DisputeStatus.RESOLVED
            dispute.resolution = resolution
            dispute.resolution_notes = request.data.get("notes", "")
            dispute.resolved_by = request.user
            dispute.resolved_at = timezone.now()
            dispute.save(update_fields=[
                "status", "resolution", "resolution_notes",
                "resolved_by", "resolved_at", "updated_at",
            ])
            try:
                notify_dispute_resolved(dispute)
            except Exception:
                pass

        elif action == "close":
            dispute.status = DisputeStatus.CLOSED
            dispute.save(update_fields=["status", "updated_at"])

        else:
            return Response({"detail": f"Unknown action: {action}"}, status=400)

        log_action(
            user=request.user,
            action=f"admin.dispute.{action}",
            target_type="Dispute",
            target_id=dispute.id,
            metadata={"resolution": dispute.resolution or ""},
            request=request,
        )

        return Response(DisputeReadSerializer(dispute).data)
