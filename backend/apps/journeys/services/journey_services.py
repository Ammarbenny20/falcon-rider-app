from django.db import transaction
from django.utils import timezone
from django.core.exceptions import PermissionDenied, ValidationError
from apps.journeys.models import Journey, JourneyStatus


class JourneyTransitionError(ValidationError):
    pass


TRANSITIONS = {
    JourneyStatus.SEARCHING: {
        JourneyStatus.MATCHING,
        JourneyStatus.CANCELLED,
    },
    JourneyStatus.MATCHING: {
        JourneyStatus.CONFIRMED,
        JourneyStatus.CANCELLED,
    },
    JourneyStatus.CONFIRMED: {
        JourneyStatus.PROVIDER_ARRIVING,
        JourneyStatus.CANCELLED,
    },
    JourneyStatus.PROVIDER_ARRIVING: {
        JourneyStatus.PROVIDER_ARRIVED,
        JourneyStatus.CANCELLED,
    },
    JourneyStatus.PROVIDER_ARRIVED: {
        JourneyStatus.IN_PROGRESS,
        JourneyStatus.CANCELLED,
    },
    JourneyStatus.IN_PROGRESS: {
        JourneyStatus.COMPLETED,
        JourneyStatus.CANCELLED,
    },
}

def _assert_transition(journey: Journey, new_status: str):
    allowed = TRANSITIONS.get(journey.status, set())
    if new_status not in allowed:
        raise JourneyTransitionError(
            f"Cannot move journey from {journey.status} to {new_status}."
        )


@transaction.atomic
def accept_journey(journey_id, provider) -> Journey:
    # select_for_update locks the row so two providers accepting
    # simultaneously can't both succeed.
    journey = Journey.objects.select_for_update().get(id=journey_id)

    if journey.provider_id is not None:
        raise JourneyTransitionError("Journey already accepted by another provider.")
    if not provider.is_eligible_to_go_online:
        raise PermissionDenied("Provider is not eligible to accept journeys.")

    _assert_transition(journey, JourneyStatus.CONFIRMED)
    journey.provider = provider
    journey.status = JourneyStatus.CONFIRMED
    journey.accepted_at = timezone.now()
    journey.save(update_fields=["provider", "status", "accepted_at"])
    return journey


@transaction.atomic
def mark_arrived(journey_id, provider) -> Journey:
    journey = Journey.objects.select_for_update().get(id=journey_id)
    _assert_owner(journey, provider)
    _assert_transition(journey, JourneyStatus.PROVIDER_ARRIVED)
    journey.status = JourneyStatus.PROVIDER_ARRIVED
    journey.arrived_at = timezone.now()
    journey.save(update_fields=["status", "arrived_at"])
    return journey


@transaction.atomic
def start_journey(journey_id, provider) -> Journey:
    journey = Journey.objects.select_for_update().get(id=journey_id)
    _assert_owner(journey, provider)
    _assert_transition(journey, JourneyStatus.IN_PROGRESS)
    journey.status = JourneyStatus.IN_PROGRESS
    journey.started_at = timezone.now()
    journey.save(update_fields=["status", "started_at"])
    return journey


@transaction.atomic
def complete_journey(journey_id, provider) -> Journey:
    from apps.payments.services import settle_journey_payment

    journey = Journey.objects.select_for_update().get(id=journey_id)
    _assert_owner(journey, provider)
    _assert_transition(journey, JourneyStatus.COMPLETED)
    journey.status = JourneyStatus.COMPLETED
    journey.completed_at = timezone.now()
    journey.save(update_fields=["status", "completed_at"])

    # Backend is the single source of truth for earnings (spec section 34)
    settle_journey_payment(journey)
    return journey


def _assert_owner(journey: Journey, provider):
    if journey.provider_id != provider.id:
        raise PermissionDenied("You do not own this journey.")