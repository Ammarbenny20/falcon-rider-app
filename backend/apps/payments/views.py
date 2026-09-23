from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.permissions import IsPassenger

from apps.bookings.models import Booking, SharedCost

from .models import Payment
from .serializers import PaymentSerializer
from .services import (
    generate_gateway_reference, process_webhook, verify_webhook_signature,
)


class PaymentInitiateView(APIView):
    permission_classes = [IsPassenger]

    def post(self, request):
        booking_id = request.data.get("booking_id")
        method = request.data.get("method", "MPESA")
        phone = request.data.get("phone_number")

        booking = get_object_or_404(
            Booking,
            pk=booking_id,
            passenger=request.user.passenger_profile,
        )
        cost = get_object_or_404(SharedCost, booking=booking)

        ref = generate_gateway_reference(method)
        payment = Payment.objects.create(
            shared_cost=cost,
            amount=cost.total_amount,
            method=method,
            status="INITIATED",
            transaction_reference=ref,
            gateway_response={
                "phone_number": phone,
                "stub": True,
                "demo_mode": True,
            },
        )

        response = {
            "payment_id": str(payment.id),
            "status": payment.status,
            "transaction_reference": ref,
            "detail": f"Check your phone for the {method} prompt",
        }

        # In demo mode, tell the frontend how to simulate the callback.
        if getattr(settings, "PAYMENT_DEMO_MODE", True):
            response["demo_confirm_endpoint"] = (
                f"/api/v1/payments/{payment.id}/confirm/"
            )
            response["demo_confirm_hint"] = (
                "POST to this endpoint to simulate gateway success (demo only)."
            )

        return Response(response)


class PaymentWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Falcon-Signature", "")
        if not verify_webhook_signature(request.data, signature):
            return Response({"detail": "Invalid signature"}, status=401)
        result = process_webhook(request.data)
        if not result.get("ok"):
            return Response({"detail": result.get("error", "failed")}, status=400)
        return Response({"detail": "OK"})


class PaymentConfirmDemoView(APIView):
    """
    POST /api/v1/payments/{id}/confirm/
    Demo-only endpoint that simulates the gateway success callback.

    It goes through the same process_webhook() path as a real gateway
    would, so the state machine and notifications fire identically.

    Request body (optional):
        { "simulate": "SUCCESS" | "FAILED" }
    Defaults to SUCCESS.
    """
    permission_classes = [IsPassenger]

    def post(self, request, pk):
        if not getattr(settings, "PAYMENT_DEMO_MODE", True):
            return Response(
                {"detail": "Demo mode is disabled."},
                status=403,
            )

        payment = get_object_or_404(
            Payment,
            pk=pk,
            shared_cost__booking__passenger=request.user.passenger_profile,
        )

        if payment.status not in ("INITIATED",):
            return Response(
                {"detail": f"Payment is {payment.status}, cannot confirm."},
                status=400,
            )

        simulate = (request.data.get("simulate") or "SUCCESS").upper()
        if simulate not in ("SUCCESS", "FAILED"):
            return Response(
                {"simulate": ["Must be SUCCESS or FAILED."]},
                status=400,
            )

        payload = {
            "transaction_reference": payment.transaction_reference,
            "status": simulate,
            "gateway_response": {
                "simulated": True,
                "by": str(request.user.id),
                "demo_mode": True,
            },
        }

        result = process_webhook(payload)
        payment.refresh_from_db()

        return Response({
            "payment_id": str(payment.id),
            "status": payment.status,
            "shared_cost_payment_status": payment.shared_cost.payment_status,
            "detail": f"Demo confirm ({simulate}) applied.",
        })


class PaymentDetailView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request, pk):
        payment = get_object_or_404(
            Payment,
            pk=pk,
            shared_cost__booking__passenger=request.user.passenger_profile,
        )
        return Response(PaymentSerializer(payment).data)
