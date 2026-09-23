"""
Receipt + reconciliation services.

Both are computed from existing records — no separate receipt model.
The receipt's `id` is derived deterministically from the booking id
so the frontend can use it as a stable key.
"""
import hashlib
from decimal import Decimal

from django.conf import settings
from django.utils import timezone


def _commission_rate():
    return Decimal(str(getattr(settings, "PLATFORM_COMMISSION_PERCENT", 15.0))) / Decimal("100")


def make_receipt_id(booking):
    """Stable, human-readable receipt id: RC-<hash>."""
    h = hashlib.sha1(str(booking.id).encode()).hexdigest()[:10].upper()
    return f"RC-{h}"


def make_receipt_number(booking):
    """Human-facing receipt number: FR-YYYY-MM-DD-<hash>."""
    d = booking.created_at.date().isoformat()
    h = hashlib.sha1(str(booking.id).encode()).hexdigest()[:6].upper()
    return f"FR-{d}-{h}"


def _duration_minutes(journey):
    if not journey or not journey.actual_start_time or not journey.actual_end_time:
        return None
    delta = journey.actual_end_time - journey.actual_start_time
    return int(delta.total_seconds() // 60)


def _payment_for_cost(cost):
    if not cost:
        return None
    return cost.payments.order_by("-initiated_at").first()


def build_receipt(booking):
    """Construct the full receipt JSON for a booking."""
    from apps.bookings.models import SharedCost
    from apps.payouts.models import ProviderEarning

    cost = SharedCost.objects.filter(booking=booking).first()
    payment = _payment_for_cost(cost)
    earning = ProviderEarning.objects.filter(booking=booking).first()

    # Journey lookup
    try:
        journey = booking.journey_plan.journey
    except Exception:
        journey = None

    # Customer
    passenger = booking.passenger
    customer = {
        "id": str(passenger.id),
        "name": passenger.user.full_name,
        "phone": passenger.user.phone_number,
    }

    # Provider
    plan = booking.journey_plan
    provider_profile = plan.provider
    provider = {
        "id": str(provider_profile.id),
        "name": provider_profile.user.full_name,
        "phone": provider_profile.user.phone_number,
    }

    # Vehicle
    v = plan.vehicle
    vehicle = {
        "type": v.transport_type,
        "plate": v.license_plate,
        "make": v.make,
        "model": v.model,
    }

    # Trip
    trip = {
        "id": str(journey.id) if journey else None,
        "origin": plan.origin_label,
        "destination": plan.destination_label,
        "distance_km": None,  # not stored per-journey currently
        "departed_at": journey.actual_start_time.isoformat() if journey and journey.actual_start_time else None,
        "arrived_at": journey.actual_end_time.isoformat() if journey and journey.actual_end_time else None,
        "duration_minutes": _duration_minutes(journey),
    }

    # Fare
    fare = {
        "currency": cost.currency if cost else "TZS",
        "total": str(cost.total_amount) if cost else "0.00",
        "breakdown": {
            "base_fare": str(cost.base_fare) if cost else "0.00",
            "distance_fare": str(cost.distance_cost) if cost else "0.00",
            "time_fare": str(cost.time_cost) if cost else "0.00",
            "platform_fee": str(cost.platform_fee) if cost else "0.00",
            "discount_amount": str(cost.discount_amount) if cost else "0.00",
        },
    }

    # Payment
    payment_data = None
    if payment:
        payment_data = {
            "method": payment.method,
            "status": payment.status,
            "transaction_ref": payment.transaction_reference,
            "paid_at": payment.completed_at.isoformat() if payment.completed_at else None,
        }

    # Earning split
    earning_split = None
    if earning:
        earning_split = {
            "provider_earning": str(earning.net_amount),
            "platform_fee": str(earning.platform_fee),
            "commission_rate": float(_commission_rate()),
        }

    return {
        "id": make_receipt_id(booking),
        "receipt_number": make_receipt_number(booking),
        "booking_id": str(booking.id),
        "trip": trip,
        "customer": customer,
        "provider": provider,
        "vehicle": vehicle,
        "fare": fare,
        "payment": payment_data,
        "earning_split": earning_split,
        "generated_at": timezone.now().isoformat(),
    }


def build_reconciliation(booking):
    """
    Compute reconciliation status for a booking.

    RECONCILED — fare == payment AND earning == fare * (1 - commission)
    EXCEPTION  — any mismatch
    PENDING    — payment not yet SUCCESS
    """
    from apps.bookings.models import SharedCost
    from apps.payouts.models import ProviderEarning

    cost = SharedCost.objects.filter(booking=booking).first()
    payment = _payment_for_cost(cost)
    earning = ProviderEarning.objects.filter(booking=booking).first()

    fare_amount = cost.total_amount if cost else Decimal("0")
    currency = cost.currency if cost else "TZS"

    payment_amount = payment.amount if payment else Decimal("0")
    earning_amount = earning.net_amount if earning else Decimal("0")
    platform_fee = earning.platform_fee if earning else Decimal("0")

    # Determine status
    status = "PENDING"
    exception_reason = None

    if not cost:
        status = "EXCEPTION"
        exception_reason = "No SharedCost for booking"
    elif not payment:
        status = "PENDING"
    elif payment.status != "SUCCESS":
        status = "PENDING"
    elif payment_amount != fare_amount:
        status = "EXCEPTION"
        exception_reason = f"Payment {payment_amount} != fare {fare_amount}"
    elif not earning:
        status = "EXCEPTION"
        exception_reason = "No ProviderEarning created"
    else:
        # Expected earning = fare * (1 - commission_rate)
        expected_net = (fare_amount * (Decimal("1") - _commission_rate())).quantize(Decimal("0.01"))
        if earning_amount != expected_net:
            status = "EXCEPTION"
            exception_reason = f"Earning {earning_amount} != expected {expected_net}"
        else:
            status = "RECONCILED"

    return {
        "id": f"RN-{str(booking.id)[:8].upper()}",
        "booking_id": str(booking.id),
        "trip_id": str(booking.journey_plan_id),
        "fare": {"amount": str(fare_amount), "currency": currency},
        "payment": {"amount": str(payment_amount), "currency": currency},
        "provider_earning": {"amount": str(earning_amount), "currency": currency},
        "platform_fee": {"amount": str(platform_fee), "currency": currency},
        "commission_rate": float(_commission_rate()),
        "status": status,
        "exception_reason": exception_reason,
        "created_at": booking.created_at.isoformat(),
    }
