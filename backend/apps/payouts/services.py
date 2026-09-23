"""
Earnings + payout service layer.
"""
from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import ProviderProfile

from .models import (
    EarningStatus, PayoutStatus,
    ProviderEarning, ProviderPayout,
)


def _commission_percent():
    return Decimal(str(getattr(settings, "PLATFORM_COMMISSION_PERCENT", 15.0)))


def compute_earnings(gross_amount):
    """Returns (platform_fee, net_amount) as Decimals."""
    gross = Decimal(str(gross_amount))
    percent = _commission_percent()
    platform_fee = (gross * percent / Decimal("100")).quantize(Decimal("0.01"), ROUND_HALF_UP)
    net = (gross - platform_fee).quantize(Decimal("0.01"), ROUND_HALF_UP)
    return platform_fee, net


@transaction.atomic
def create_earning_for_booking(booking):
    """
    Called when a booking is confirmed. Creates a ProviderEarning row
    with the platform commission split out.
    """
    from apps.bookings.models import SharedCost

    # Idempotent — do nothing if earning exists
    if ProviderEarning.objects.filter(booking=booking).exists():
        return ProviderEarning.objects.get(booking=booking)

    # Get the gross amount from the booking's SharedCost
    cost = SharedCost.objects.filter(booking=booking).first()
    if not cost:
        return None

    gross = cost.total_amount
    platform_fee, net = compute_earnings(gross)

    provider = booking.journey_plan.provider

    return ProviderEarning.objects.create(
        provider=provider,
        booking=booking,
        journey_plan=booking.journey_plan,
        gross_amount=gross,
        platform_fee=platform_fee,
        net_amount=net,
        currency=cost.currency,
        status=EarningStatus.AVAILABLE,
    )


@transaction.atomic
def generate_payouts(provider_id=None, period_start=None, period_end=None):
    """
    Group pending AVAILABLE earnings into one payout per provider.
    Returns list of created payouts.
    """
    qs = ProviderEarning.objects.filter(
        status=EarningStatus.AVAILABLE, payout__isnull=True,
    ).select_related("provider")

    if provider_id:
        qs = qs.filter(provider_id=provider_id)
    if period_start:
        qs = qs.filter(earned_at__gte=period_start)
    if period_end:
        qs = qs.filter(earned_at__lte=period_end)

    # Group by provider
    providers_to_amount = {}
    for earning in qs:
        providers_to_amount.setdefault(earning.provider_id, []).append(earning)

    created_payouts = []
    for provider_id, earnings in providers_to_amount.items():
        total = sum(e.net_amount for e in earnings)
        if total <= 0:
            continue

        payout = ProviderPayout.objects.create(
            provider_id=provider_id,
            period_start=period_start,
            period_end=period_end or timezone.now(),
            amount=total,
            currency=earnings[0].currency,
            status=PayoutStatus.PENDING,
        )

        # Link earnings to this payout
        ProviderEarning.objects.filter(
            id__in=[e.id for e in earnings]
        ).update(payout=payout, status=EarningStatus.PENDING)

        created_payouts.append(payout)

    return created_payouts
