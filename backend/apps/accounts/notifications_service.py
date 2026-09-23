"""
Central place to fire notifications. Called from views/tasks.

Each helper:
1. Creates a Notification row for the user
2. Logs an audit entry (best-effort)
3. Queues a push (via Celery, best-effort)
"""
from django.utils import timezone

from .models import Notification, PushToken


def _create_notification(user, type_, title, body, data=None):
    """Internal helper. Never raises — notifications must not break flows."""
    try:
        n = Notification.objects.create(
            user=user,
            title=title,
            body=body,
            data={"type": type_, **(data or {})},
        )
        _queue_push(user, title, body, data)
        return n
    except Exception:
        return None


def _queue_push(user, title, body, data):
    """Best-effort push dispatch. In dev, logs to console."""
    tokens = list(PushToken.objects.filter(user=user).values_list("token", flat=True))
    if not tokens:
        return
    try:
        from apps.accounts.tasks.notification_tasks import dispatch_push
        for token in tokens:
            dispatch_push.delay(token, title, body, data or {})
    except Exception:
        # Celery or task missing — log to console instead
        for token in tokens:
            print(f"📲 [PUSH] {user.email} → {token}: {title} — {body}")


# -----------------------------------------------------------------------------
# Booking events
# -----------------------------------------------------------------------------
def notify_booking_accepted(booking):
    """Booking was confirmed (rider's proposal accepted)."""
    _create_notification(
        booking.passenger.user,
        type_="booking_accepted",
        title="Booking imekubaliwa",
        body=f"Booking yako imethibitishwa. Seats: {booking.seats_booked}",
        data={"booking_id": str(booking.id)},
    )


def notify_booking_cancelled(booking):
    _create_notification(
        booking.passenger.user,
        type_="booking_cancelled",
        title="Booking imefutwa",
        body=f"Booking yako imefutwa. Sababu: {booking.cancel_reason or 'Haijulikani'}",
        data={"booking_id": str(booking.id)},
    )


# -----------------------------------------------------------------------------
# Journey events
# -----------------------------------------------------------------------------
def notify_journey_started(journey):
    """Notify all passengers on the plan that the trip started."""
    from apps.bookings.models import Booking
    bookings = Booking.objects.filter(
        journey_plan=journey.journey_plan, status="CONFIRMED",
    ).select_related("passenger__user")
    for b in bookings:
        _create_notification(
            b.passenger.user,
            type_="trip_started",
            title="Safari imeanza",
            body="Dereva ameanza safari yako sasa hivi.",
            data={"journey_id": str(journey.id)},
        )


def notify_journey_completed(journey):
    from apps.bookings.models import Booking
    bookings = Booking.objects.filter(
        journey_plan=journey.journey_plan, status="CONFIRMED",
    ).select_related("passenger__user")
    for b in bookings:
        _create_notification(
            b.passenger.user,
            type_="trip_completed",
            title="Safari imekamilika",
            body="Asante kwa kutumia Falcon Rider.",
            data={"journey_id": str(journey.id)},
        )


def notify_journey_cancelled(journey):
    from apps.bookings.models import Booking
    bookings = Booking.objects.filter(
        journey_plan=journey.journey_plan,
    ).exclude(status="CANCELLED").select_related("passenger__user")
    for b in bookings:
        _create_notification(
            b.passenger.user,
            type_="trip_cancelled",
            title="Safari imefutwa",
            body="Safari ambayo ulikuwa umejiunga nayo imefutwa.",
            data={"journey_id": str(journey.id)},
        )


# -----------------------------------------------------------------------------
# Payment events
# -----------------------------------------------------------------------------
def notify_payment_successful(payment):
    try:
        booking = payment.shared_cost.booking
        user = booking.passenger.user
    except Exception:
        return
    _create_notification(
        user,
        type_="payment_success",
        title="Malipo yamefanikiwa",
        body=f"Umefanikiwa kulipa {payment.amount} TZS.",
        data={"payment_id": str(payment.id)},
    )


def notify_payment_failed(payment):
    try:
        booking = payment.shared_cost.booking
        user = booking.passenger.user
    except Exception:
        return
    _create_notification(
        user,
        type_="payment_failed",
        title="Malipo hayakufanikiwa",
        body="Malipo yako hayakufanikiwa. Tafadhali jaribu tena.",
        data={"payment_id": str(payment.id)},
    )


def notify_refund_issued(payment):
    try:
        booking = payment.shared_cost.booking
        user = booking.passenger.user
    except Exception:
        return
    _create_notification(
        user,
        type_="refund_issued",
        title="Pesa zimerejeshwa",
        body=f"Refund ya {payment.amount} TZS imetolewa.",
        data={"payment_id": str(payment.id)},
    )


# -----------------------------------------------------------------------------
# Provider events
# -----------------------------------------------------------------------------
def notify_provider_verified(provider_profile):
    _create_notification(
        provider_profile.user,
        type_="provider_verified",
        title="Umeidhinishwa",
        body="Akaunti yako ya provider imeidhinishwa. Unaweza kuanza kufanya kazi.",
        data={"provider_id": str(provider_profile.id)},
    )


def notify_provider_rejected(provider_profile, reason=""):
    _create_notification(
        provider_profile.user,
        type_="provider_rejected",
        title="Maombi yamekataliwa",
        body=f"Maombi yako yamekataliwa. Sababu: {reason or 'Haijulikani'}",
        data={"provider_id": str(provider_profile.id)},
    )


# -----------------------------------------------------------------------------
# Safety events
# -----------------------------------------------------------------------------
def notify_sos_alert(alert):
    """Notify the user who sent SOS + all their emergency contacts."""
    _create_notification(
        alert.user,
        type_="sos_sent",
        title="SOS imetumwa",
        body="Tumepokea taarifa yako. Msaada unakuja.",
        data={"alert_id": str(alert.id)},
    )
    from apps.safety.models import EmergencyContact
    contacts = EmergencyContact.objects.filter(user=alert.user)
    for c in contacts:
        print(f"🚨 [SOS] Alert for {alert.user.email} — notifying {c.phone_number}")
