"""
Admin analytics + disputes + refunds.
"""
from datetime import timedelta

from django.db.models import Count, Sum, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import log_action
from core.permissions import IsAdmin

from apps.bookings.models import Booking, SharedCost
from apps.journey_plans.models import JourneyPlan
from apps.journeys.models import Journey
from apps.payments.models import Payment
from apps.rider_requests.models import RiderRequest

from .models import ProviderProfile, User


# -----------------------------------------------------------------------------
# Analytics
# -----------------------------------------------------------------------------
class AdminAnalyticsView(APIView):
    """Top-level dashboard summary."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        last_7d = now - timedelta(days=7)
        last_30d = now - timedelta(days=30)

        return Response({
            "users": {
                "total": User.objects.count(),
                "passengers": User.objects.filter(role="PASSENGER").count(),
                "providers": User.objects.filter(role="PROVIDER").count(),
                "admins": User.objects.filter(role="ADMIN").count(),
                "new_last_7d": User.objects.filter(created_at__gte=last_7d).count(),
            },
            "providers": {
                "total": ProviderProfile.objects.count(),
                "pending": ProviderProfile.objects.filter(
                    verification_status__in=["REGISTERED", "PENDING_VERIFICATION"]
                ).count(),
                "verified": ProviderProfile.objects.filter(verification_status="VERIFIED").count(),
            },
            "rides": {
                "requests_total": RiderRequest.objects.count(),
                "requests_last_7d": RiderRequest.objects.filter(created_at__gte=last_7d).count(),
                "active": RiderRequest.objects.filter(
                    status__in=["SUBMITTED", "MATCHING", "MATCHED", "CONFIRMED", "BOOKED"]
                ).count(),
            },
            "journeys": {
                "plans_total": JourneyPlan.objects.count(),
                "plans_published": JourneyPlan.objects.filter(status="PUBLISHED").count(),
                "journeys_total": Journey.objects.count(),
                "journeys_in_progress": Journey.objects.filter(status="IN_PROGRESS").count(),
                "journeys_completed": Journey.objects.filter(status="COMPLETED").count(),
            },
            "bookings": {
                "total": Booking.objects.count(),
                "confirmed": Booking.objects.filter(status="CONFIRMED").count(),
                "cancelled": Booking.objects.filter(status="CANCELLED").count(),
                "last_30d": Booking.objects.filter(created_at__gte=last_30d).count(),
            },
            "generated_at": now.isoformat(),
        })


class AdminRevenueAnalyticsView(APIView):
    """Revenue + payment metrics."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        last_7d = now - timedelta(days=7)
        last_30d = now - timedelta(days=30)

        paid_costs = SharedCost.objects.filter(payment_status="PAID")
        total_revenue = paid_costs.aggregate(total=Sum("total_amount"))["total"] or 0

        revenue_30d = (
            paid_costs.filter(created_at__gte=last_30d)
            .aggregate(total=Sum("total_amount"))["total"] or 0
        )
        revenue_7d = (
            paid_costs.filter(created_at__gte=last_7d)
            .aggregate(total=Sum("total_amount"))["total"] or 0
        )

        payments = Payment.objects.all()
        return Response({
            "currency": "TZS",
            "revenue": {
                "all_time": str(total_revenue),
                "last_30d": str(revenue_30d),
                "last_7d": str(revenue_7d),
            },
            "payments": {
                "total": payments.count(),
                "success": payments.filter(status="SUCCESS").count(),
                "failed": payments.filter(status="FAILED").count(),
                "initiated": payments.filter(status="INITIATED").count(),
                "refunded": payments.filter(status="REFUNDED").count(),
            },
            "shared_costs": {
                "pending": SharedCost.objects.filter(payment_status="PENDING").count(),
                "paid": SharedCost.objects.filter(payment_status="PAID").count(),
                "refunded": SharedCost.objects.filter(payment_status="REFUNDED").count(),
            },
            "generated_at": now.isoformat(),
        })


class AdminTripsAnalyticsView(APIView):
    """Trip-level metrics."""
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        last_7d = now - timedelta(days=7)

        return Response({
            "journeys": {
                "total": Journey.objects.count(),
                "last_7d": Journey.objects.filter(created_at__gte=last_7d).count(),
                "by_status": {
                    s: Journey.objects.filter(status=s).count()
                    for s in ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ABORTED", "CANCELLED"]
                },
            },
            "plans": {
                "total": JourneyPlan.objects.count(),
                "by_status": {
                    s: JourneyPlan.objects.filter(status=s).count()
                    for s in ["DRAFT", "PUBLISHED", "FULL", "IN_PROGRESS", "COMPLETED", "ABORTED", "CANCELLED"]
                },
            },
            "generated_at": now.isoformat(),
        })


# -----------------------------------------------------------------------------
# Disputes (stub — extend when the model exists)
# -----------------------------------------------------------------------------
class AdminRefundPaymentView(APIView):
    """
    POST /admin/payments/{id}/refund/
    Marks a payment as REFUNDED and the SharedCost as REFUNDED.
    Real gateway refund integration comes later.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)

        if payment.status != "SUCCESS":
            return Response(
                {"detail": f"Payment is {payment.status}; only SUCCESS can be refunded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment.status = "REFUNDED"
        payment.gateway_response = {
            **(payment.gateway_response or {}),
            "refund": {
                "by": str(request.user.id),
                "at": timezone.now().isoformat(),
                "reason": request.data.get("reason", ""),
            },
        }
        payment.save(update_fields=["status", "gateway_response"])

        sc = payment.shared_cost
        sc.payment_status = "REFUNDED"
        sc.save(update_fields=["payment_status"])

        # Notify passenger
        try:
            from .notifications_service import notify_refund_issued
            notify_refund_issued(payment)
        except Exception:
            pass

        log_action(
            user=request.user,
            action="admin.payment.refund",
            target_type="Payment",
            target_id=payment.id,
            metadata={"reason": request.data.get("reason", "")},
            request=request,
        )

        return Response({
            "id": str(payment.id),
            "status": payment.status,
            "shared_cost_status": sc.payment_status,
        })
