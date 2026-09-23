from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import log_action
from core.permissions import IsAdmin, IsProvider

from .models import EarningStatus, PayoutStatus, ProviderEarning, ProviderPayout
from .serializers import (
    ProviderEarningSerializer, ProviderPayoutSerializer, GeneratePayoutsSerializer,
)
from .services import generate_payouts
from .notifications import (
    notify_provider_payout_created, notify_provider_payout_approved,
    notify_provider_payout_paid, notify_provider_payout_rejected,
)


def _paginate(request, qs, serializer_class):
    try:
        page = int(request.query_params.get("page", 1))
        size = min(int(request.query_params.get("page_size", 20)), 100)
    except ValueError:
        page, size = 1, 20
    total = qs.count()
    items = qs[(page - 1) * size : page * size]
    return {
        "count": total, "page": page, "page_size": size,
        "results": serializer_class(items, many=True).data,
    }


# -----------------------------------------------------------------------------
# Provider — my earnings + my payouts
# -----------------------------------------------------------------------------
class MyEarningsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = ProviderEarning.objects.filter(
            provider=request.user.provider_profile
        ).order_by("-earned_at")
        return Response(_paginate(request, qs, ProviderEarningSerializer))


class MyPayoutsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = ProviderPayout.objects.filter(
            provider=request.user.provider_profile
        ).order_by("-created_at")
        return Response(_paginate(request, qs, ProviderPayoutSerializer))


# -----------------------------------------------------------------------------
# Admin — earnings list
# -----------------------------------------------------------------------------
class AdminEarningsListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = ProviderEarning.objects.all().select_related(
            "provider__user", "booking",
        ).order_by("-earned_at")

        s = request.query_params.get("status")
        provider_id = request.query_params.get("provider_id")
        if s:
            qs = qs.filter(status=s.upper())
        if provider_id:
            qs = qs.filter(provider_id=provider_id)

        return Response(_paginate(request, qs, ProviderEarningSerializer))


# -----------------------------------------------------------------------------
# Admin — payouts list + actions
# -----------------------------------------------------------------------------
class AdminPayoutListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = ProviderPayout.objects.all().select_related(
            "provider__user", "approved_by",
        ).order_by("-created_at")

        s = request.query_params.get("status")
        provider_id = request.query_params.get("provider_id")
        if s:
            qs = qs.filter(status=s.upper())
        if provider_id:
            qs = qs.filter(provider_id=provider_id)

        return Response(_paginate(request, qs, ProviderPayoutSerializer))


class AdminPayoutDetailView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        payout = get_object_or_404(ProviderPayout, pk=pk)
        data = ProviderPayoutSerializer(payout).data
        # Include linked earnings
        earnings = ProviderEarning.objects.filter(payout=payout)
        data["earnings"] = ProviderEarningSerializer(earnings, many=True).data
        return Response(data)


class AdminPayoutActionView(APIView):
    """
    POST /admin/payouts/{id}/<action>/
    Actions: approve, reject, mark-paid
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk, action):
        payout = get_object_or_404(ProviderPayout, pk=pk)

        if action == "approve":
            if payout.status != PayoutStatus.PENDING:
                return Response({"detail": f"Payout is {payout.status}."}, status=400)
            payout.status = PayoutStatus.APPROVED
            payout.approved_by = request.user
            payout.approved_at = timezone.now()
            payout.save(update_fields=["status", "approved_by", "approved_at", "updated_at"])
            try:
                notify_provider_payout_approved(payout)
            except Exception:
                pass

        elif action == "reject":
            if payout.status != PayoutStatus.PENDING:
                return Response({"detail": f"Payout is {payout.status}."}, status=400)
            payout.status = PayoutStatus.REJECTED
            payout.rejected_reason = request.data.get("reason", "") or ""
            payout.save(update_fields=["status", "rejected_reason", "updated_at"])
            # Release earnings back to AVAILABLE
            ProviderEarning.objects.filter(payout=payout).update(
                payout=None, status=EarningStatus.AVAILABLE,
            )
            try:
                notify_provider_payout_rejected(payout)
            except Exception:
                pass

        elif action == "mark-paid":
            if payout.status != PayoutStatus.APPROVED:
                return Response({"detail": f"Payout is {payout.status}, only APPROVED can be paid."}, status=400)
            ref = request.data.get("transaction_reference")
            if not ref:
                return Response({"transaction_reference": ["Required."]}, status=400)
            payout.status = PayoutStatus.PAID
            payout.transaction_reference = ref
            payout.paid_at = timezone.now()
            payout.save(update_fields=["status", "transaction_reference", "paid_at", "updated_at"])
            # Mark earnings PAID_OUT
            ProviderEarning.objects.filter(payout=payout).update(status=EarningStatus.PAID_OUT)
            try:
                notify_provider_payout_paid(payout)
            except Exception:
                pass

        else:
            return Response({"detail": f"Unknown action: {action}"}, status=400)

        log_action(
            user=request.user,
            action=f"admin.payout.{action}",
            target_type="ProviderPayout",
            target_id=payout.id,
            metadata={"amount": str(payout.amount)},
            request=request,
        )

        return Response(ProviderPayoutSerializer(payout).data)


class AdminGeneratePayoutsView(APIView):
    """POST /admin/payouts/generate/ — batch-create pending payouts."""
    permission_classes = [IsAdmin]

    def post(self, request):
        s = GeneratePayoutsSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        d = s.validated_data

        payouts = generate_payouts(
            provider_id=d.get("provider_id"),
            period_start=d.get("period_start"),
            period_end=d.get("period_end"),
        )

        for p in payouts:
            try:
                notify_provider_payout_created(p)
            except Exception:
                pass

        log_action(
            user=request.user,
            action="admin.payout.generate",
            target_type="ProviderPayout",
            target_id="",
            metadata={"payouts_created": len(payouts)},
            request=request,
        )

        return Response({
            "payouts_created": len(payouts),
            "payouts": ProviderPayoutSerializer(payouts, many=True).data,
        }, status=status.HTTP_201_CREATED)
