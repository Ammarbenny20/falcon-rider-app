from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin, IsPassenger

from apps.bookings.models import Booking

from .services import build_receipt, build_reconciliation


def _paginate(request, qs, serializer_fn):
    try:
        page = int(request.query_params.get("page", 1))
        size = min(int(request.query_params.get("page_size", 20)), 100)
    except ValueError:
        page, size = 1, 20
    total = qs.count()
    items = qs[(page - 1) * size : page * size]
    return {
        "count": total, "page": page, "page_size": size,
        "results": [serializer_fn(x) for x in items],
    }


# -----------------------------------------------------------------------------
# Passenger-facing
# -----------------------------------------------------------------------------
class MyReceiptsView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request):
        qs = Booking.objects.filter(
            passenger=request.user.passenger_profile,
            status__in=["COMPLETED", "CONFIRMED"],
        ).order_by("-created_at")
        return Response(_paginate(request, qs, build_receipt))


class MyReceiptDetailView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request, pk):
        # pk is the booking id here
        booking = get_object_or_404(
            Booking, pk=pk, passenger=request.user.passenger_profile,
        )
        return Response(build_receipt(booking))


# -----------------------------------------------------------------------------
# Admin
# -----------------------------------------------------------------------------
class AdminReceiptListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Booking.objects.filter(
            status__in=["COMPLETED", "CONFIRMED"],
        ).order_by("-created_at")
        return Response(_paginate(request, qs, build_receipt))


class AdminReceiptDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        # pk is the booking id
        booking = get_object_or_404(Booking, pk=pk)
        return Response(build_receipt(booking))


# -----------------------------------------------------------------------------
# Reconciliation
# -----------------------------------------------------------------------------
class AdminReconciliationListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Booking.objects.all().order_by("-created_at")

        status_filter = request.query_params.get("status")
        if status_filter:
            # Filter post-computation (small datasets; can push to SQL later)
            all_results = [build_reconciliation(b) for b in qs[:500]]
            filtered = [r for r in all_results if r["status"] == status_filter.upper()]
            return Response({
                "count": len(filtered),
                "page": 1,
                "page_size": len(filtered) or 20,
                "results": filtered,
            })

        return Response(_paginate(request, qs, build_reconciliation))


class AdminReconciliationExceptionsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = Booking.objects.all().order_by("-created_at")[:500]
        exceptions = [build_reconciliation(b) for b in qs]
        exceptions = [e for e in exceptions if e["status"] == "EXCEPTION"]
        return Response({
            "count": len(exceptions),
            "results": exceptions,
        })


class AdminReconciliationDetailView(APIView):
    """Look up reconciliation for a specific booking (by booking id)."""
    permission_classes = [IsAdmin]

    def get(self, request, trip_id):
        booking = get_object_or_404(Booking, pk=trip_id)
        return Response(build_reconciliation(booking))
