from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone

from apps.payments.models import Payment, PaymentStatus
from apps.payments.serializers import PaymentSerializer
from permissions.roles import IsAdminRole


class PaymentViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "method"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Payment.objects.all().order_by("-created_at")
        if user.role == "PROVIDER":
            provider = getattr(user, "provider_profile", None)
            return Payment.objects.filter(provider=provider).order_by("-created_at")
        return Payment.objects.filter(passenger=user).order_by("-created_at")


class AdminPaymentsSummaryView(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Spec section 47 — admin payments overview, computed live."""
    permission_classes = [IsAdminRole]

    def list(self, request):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        successful = Payment.objects.filter(status=PaymentStatus.SUCCESSFUL)
        return Response({
            "todays_revenue": successful.filter(settled_at__gte=today_start).aggregate(
                total=Sum("platform_fee_amount"))["total"] or 0,
            "total_revenue": successful.aggregate(total=Sum("platform_fee_amount"))["total"] or 0,
            "pending_payments": Payment.objects.filter(status=PaymentStatus.PENDING).count(),
            "successful_payments": successful.count(),
            "failed_payments": Payment.objects.filter(status=PaymentStatus.FAILED).count(),
            "refunds": Payment.objects.filter(status=PaymentStatus.REFUNDED).count(),
        })