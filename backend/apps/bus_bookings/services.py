from django.db import transaction
from django.core.exceptions import ValidationError

from apps.bus_bookings.models import BusBooking, BusBookingStatus


TRANSITIONS = {
    BusBookingStatus.REQUESTED: {
        BusBookingStatus.NEEDS_ACTION,
        BusBookingStatus.REVIEWING,
        BusBookingStatus.CANCELLED,
    },
    BusBookingStatus.REVIEWING: {
        BusBookingStatus.NEEDS_ACTION,
        BusBookingStatus.CANCELLED,
        BusBookingStatus.BUS_ASSIGNED,
    },
    BusBookingStatus.BUS_ASSIGNED: {
        BusBookingStatus.NEEDS_ACTION,
        BusBookingStatus.CONFIRMED,
        BusBookingStatus.CANCELLED,
    },
    BusBookingStatus.CONFIRMED: {
        BusBookingStatus.READY_FOR_DEPARTURE,
        BusBookingStatus.CANCELLED,
    },
    BusBookingStatus.READY_FOR_DEPARTURE: {
        BusBookingStatus.VEHICLE_ARRIVING,
        BusBookingStatus.CANCELLED,
    },
    BusBookingStatus.VEHICLE_ARRIVING: {
        BusBookingStatus.IN_PROGRESS,
        BusBookingStatus.CANCELLED,
    },
    BusBookingStatus.IN_PROGRESS: {
        BusBookingStatus.COMPLETED,
    },
    BusBookingStatus.NEEDS_ACTION: {
        BusBookingStatus.CANCELLED,
        BusBookingStatus.REVIEWING,
    },
}


def _assert_transition(booking, new_status):
    allowed = TRANSITIONS.get(booking.status, set())

    if new_status not in allowed:
        raise ValidationError(
            f"Cannot move bus booking from {booking.status} to {new_status}."
        )


@transaction.atomic
def transition(
    booking_id,
    new_status,
    admin_user=None,
    **extra_fields
):
    booking = BusBooking.objects.select_for_update().get(id=booking_id)

    _assert_transition(booking, new_status)

    booking.status = new_status

    for field, value in extra_fields.items():
        setattr(booking, field, value)

    booking.save()

    if admin_user:
        from apps.administration.models import AuditLog

        AuditLog.objects.create(
            actor=admin_user,
            action=f"BUS_BOOKING_{new_status}",
            entity="BusBooking",
            entity_id=str(booking.id),
        )

    return booking