from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from apps.payments.models import Payment, PaymentStatus, PaymentMethod


@transaction.atomic
def settle_journey_payment(journey, method: str = PaymentMethod.CASH) -> Payment:
    """
    Backend is the single source of truth for fare math (spec section 34/46).
    Commission % is read from settings (env-configurable), never from the
    mobile client.
    """
    if journey.fare_amount is None:
        raise ValueError("Journey has no fare set; cannot settle payment.")

    commission_percent = Decimal(str(settings.PLATFORM_COMMISSION_PERCENT))
    fare = Decimal(journey.fare_amount)
    platform_fee = (fare * commission_percent / Decimal("100")).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    provider_earning = fare - platform_fee

    payment, _ = Payment.objects.get_or_create(
        journey=journey,
        defaults=dict(
            passenger=journey.passenger,
            provider=journey.provider,
            fare_amount=fare,
            platform_fee_amount=platform_fee,
            provider_earning_amount=provider_earning,
            commission_percent_applied=commission_percent,
            method=method,
        ),
    )
    # Prevent duplicate settlement on retry (spec section 58)
    if payment.status == PaymentStatus.SUCCESSFUL:
        return payment

    payment.status = PaymentStatus.SUCCESSFUL
    payment.settled_at = timezone.now()
    payment.save(update_fields=["status", "settled_at"])

    journey.fare_amount = fare
    journey.platform_fee_amount = platform_fee
    journey.provider_earning_amount = provider_earning
    journey.payment_status = PaymentStatus.SUCCESSFUL
    journey.save(update_fields=["fare_amount", "platform_fee_amount", "provider_earning_amount", "payment_status"])

    return payment