from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.audit import log_action
from core.permissions import IsAdmin

from apps.bookings.models import Booking, SharedCost
from apps.payments.models import Payment

from .models import RefundRequest, RefundRequestStatus
from .serializers import RefundRequestCreateSerializer, RefundRequestReadSerializer
from .notifications import notify_admins_refund_filed, notify_customer_refund_decision


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
        "results": RefundRequestReadSerializer(items, many=True).data,
    }


class FileRefundRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RefundRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        booking = get_object_or_404(
            Booking, pk=d["booking_id"], passenger__user=request.user,
        )

        payment = None
        if d.get("payment_id"):
            payment = get_object_or_404(Payment, pk=d["payment_id"])

        # Default amount = full cost if not specified
        if d.get("amount"):
            amount = d["amount"]
        else:
            cost = SharedCost.objects.filter(booking=booking).first()
            amount = cost.total_amount if cost else 0

        rr = RefundRequest.objects.create(
            requested_by=request.user,
            booking=booking,
            payment=payment,
            amount=amount,
            currency="TZS",
            reason=d["reason"],
            description=d["description"],
            evidence=d.get("evidence", []),
        )

        try:
            notify_admins_refund_filed(rr)
        except Exception:
            pass

        log_action(
            user=request.user,
            action="refund_request.filed",
            target_type="RefundRequest",
            target_id=rr.id,
            metadata={"amount": str(amount), "reason": rr.reason},
            request=request,
        )

        return Response(
            RefundRequestReadSerializer(rr).data,
            status=status.HTTP_201_CREATED,
        )


class MyRefundRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = RefundRequest.objects.filter(requested_by=request.user).order_by("-created_at")
        return Response(_paginate(request, qs))


class AdminRefundRequestListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = RefundRequest.objects.all().select_related("requested_by").order_by("-created_at")

        s = request.query_params.get("status")
        if s:
            qs = qs.filter(status=s.upper())

        return Response(_paginate(request, qs))


class AdminRefundRequestDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        rr = get_object_or_404(RefundRequest, pk=pk)
        return Response(RefundRequestReadSerializer(rr).data)


class AdminRefundRequestDecisionView(APIView):
    """
    POST /admin/refund-requests/{id}/<action>/
    Actions: approve, reject, complete
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk, action):
        rr = get_object_or_404(RefundRequest, pk=pk)

        if action == "approve":
            if rr.status != "PENDING":
                return Response({"detail": f"Request is {rr.status}."}, status=400)
            rr.status = RefundRequestStatus.APPROVED
            rr.reviewed_by = request.user
            rr.reviewed_at = timezone.now()
            rr.review_notes = request.data.get("notes", "") or ""
            rr.save(update_fields=["status", "reviewed_by", "reviewed_at", "review_notes", "updated_at"])

        elif action == "reject":
            if rr.status != "PENDING":
                return Response({"detail": f"Request is {rr.status}."}, status=400)
            rr.status = RefundRequestStatus.REJECTED
            rr.reviewed_by = request.user
            rr.reviewed_at = timezone.now()
            rr.review_notes = request.data.get("notes", "") or ""
            rr.save(update_fields=["status", "reviewed_by", "reviewed_at", "review_notes", "updated_at"])

        elif action == "complete":
            if rr.status != "APPROVED":
                return Response({"detail": f"Request is {rr.status}, only APPROVED can be completed."}, status=400)
            # Flip the payment + shared cost to REFUNDED
            if rr.payment:
                rr.payment.status = "REFUNDED"
                rr.payment.save(update_fields=["status"])
            cost = SharedCost.objects.filter(booking=rr.booking).first()
            if cost:
                cost.payment_status = "REFUNDED"
                cost.save(update_fields=["payment_status"])
            rr.status = RefundRequestStatus.COMPLETED
            rr.completed_at = timezone.now()
            rr.save(update_fields=["status", "completed_at", "updated_at"])

        else:
            return Response({"detail": f"Unknown action: {action}"}, status=400)

        try:
            notify_customer_refund_decision(rr)
        except Exception:
            pass

        log_action(
            user=request.user,
            action=f"admin.refund_request.{action}",
            target_type="RefundRequest",
            target_id=rr.id,
            metadata={"notes": rr.review_notes or ""},
            request=request,
        )

        return Response(RefundRequestReadSerializer(rr).data)
