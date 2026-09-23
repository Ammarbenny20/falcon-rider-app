"""
End-to-end tests for booking + matching + journey + ownership.
"""
import pytest
from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User, PassengerProfile, ProviderProfile
from apps.vehicles.models import Vehicle
from apps.journey_plans.models import JourneyPlan
from apps.rider_requests.models import RiderRequest
from apps.matching.models import MatchProposal
from apps.bookings.models import Booking, SharedCost
from apps.journeys.models import Journey


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def passenger(db):
    u = User.objects.create_user(
        email="pax_bk@test.local", full_name="Pax BK",
        password="PaxPass123", role="PASSENGER",
    )
    PassengerProfile.objects.get_or_create(user=u)
    return u


@pytest.fixture
def provider(db):
    u = User.objects.create_user(
        email="prov_bk@test.local", full_name="Prov BK",
        password="ProvPass123", role="PROVIDER",
    )
    profile = ProviderProfile.objects.create(
        user=u, verification_status="VERIFIED", vehicle_type="CAR",
    )
    return u, profile


@pytest.fixture
def vehicle(provider):
    _, profile = provider
    return Vehicle.objects.create(
        provider=profile, transport_type="CAR",
        make="Toyota", model="Corolla", year=2020,
        license_plate="TBK0001", capacity=4, color="White",
    )


@pytest.fixture
def journey_plan(provider, vehicle):
    _, profile = provider
    return JourneyPlan.objects.create(
        provider=profile, vehicle=vehicle,
        origin="39.2083,-6.7924, srid=4326",
        origin_label="Kariakoo",
        destination="39.2695,-6.8235, srid=4326",
        destination_label="Mlimani",
        scheduled_departure_time=timezone.now() + timedelta(hours=2),
        total_seats=4, available_seats=4,
        price_per_seat=2000, status="PUBLISHED",
    )


@pytest.fixture
def rider_request(passenger):
    return RiderRequest.objects.create(
        passenger=passenger.passenger_profile,
        origin="39.2083,-6.7924, srid=4326", origin_label="Kariakoo",
        destination="39.2695,-6.8235, srid=4326", destination_label="Mlimani",
        requested_time=timezone.now() + timedelta(hours=2),
        seats_needed=2, booking_type="NOW",
        ride_access_type="SHARED", transport_mode="CAR",
        status="SUBMITTED",
    )


@pytest.fixture
def proposal(rider_request, journey_plan):
    return MatchProposal.objects.create(
        rider_request=rider_request, journey_plan=journey_plan,
        match_score=0.95, proposed_fare_share=4000,
        proposed_pickup_time=journey_plan.scheduled_departure_time,
        status="PROPOSED",
        expires_at=timezone.now() + timedelta(minutes=30),
    )


# -----------------------------------------------------------------------------
# Booking create
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_booking_create_decrements_seats(api_client, passenger, proposal, journey_plan):
    api_client.force_authenticate(user=passenger)
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(proposal.id),
    }, format="json")
    assert r.status_code == 201, r.content
    assert r.data["status"] == "CONFIRMED"
    assert r.data["seats_booked"] == 2

    # JourneyPlan seats decremented
    journey_plan.refresh_from_db()
    assert journey_plan.available_seats == 2

    # Proposal marked ACCEPTED
    proposal.refresh_from_db()
    assert proposal.status == "ACCEPTED"

    # SharedCost created
    booking_id = r.data["id"]
    assert SharedCost.objects.filter(booking_id=booking_id).exists()

    # Journey auto-created (A3 fix)
    assert Journey.objects.filter(journey_plan=journey_plan).exists()


@pytest.mark.django_db
def test_booking_rejects_other_passenger(api_client, proposal):
    """A passenger cannot book another passenger's proposal."""
    other = User.objects.create_user(
        email="other_pax@test.local", full_name="Other",
        password="OtherPass123", role="PASSENGER",
    )
    PassengerProfile.objects.get_or_create(user=other)

    api_client.force_authenticate(user=other)
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(proposal.id),
    }, format="json")
    assert r.status_code == 400


@pytest.mark.django_db
def test_booking_rejects_oversell(api_client, passenger, rider_request, journey_plan):
    """Cannot book more seats than available."""
    rider_request.seats_needed = 5   # more than 4 available
    rider_request.save()

    p = MatchProposal.objects.create(
        rider_request=rider_request, journey_plan=journey_plan,
        match_score=0.9, proposed_fare_share=10000,
        proposed_pickup_time=journey_plan.scheduled_departure_time,
        status="PROPOSED",
        expires_at=timezone.now() + timedelta(minutes=30),
    )

    api_client.force_authenticate(user=passenger)
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(p.id),
    }, format="json")
    assert r.status_code == 400


# -----------------------------------------------------------------------------
# Booking cancel restores seats (B3 fix)
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_booking_cancel_restores_seats(api_client, passenger, proposal, journey_plan):
    api_client.force_authenticate(user=passenger)

    # Book
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(proposal.id),
    }, format="json")
    booking_id = r.data["id"]
    journey_plan.refresh_from_db()
    assert journey_plan.available_seats == 2

    # Cancel
    r2 = api_client.post(f"/api/v1/bookings/{booking_id}/cancel/", {
        "reason": "Changed mind",
    }, format="json")
    assert r2.status_code == 200
    assert r2.data["status"] == "CANCELLED"

    # Seats restored
    journey_plan.refresh_from_db()
    assert journey_plan.available_seats == 4


# -----------------------------------------------------------------------------
# Ownership
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_booking_detail_requires_owner(api_client, passenger, proposal, journey_plan):
    """Passenger can only see their own bookings."""
    api_client.force_authenticate(user=passenger)
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(proposal.id),
    }, format="json")
    booking_id = r.data["id"]

    # Other passenger tries
    other = User.objects.create_user(
        email="other_pax2@test.local", full_name="Other2",
        password="OtherPass123", role="PASSENGER",
    )
    PassengerProfile.objects.get_or_create(user=other)
    api_client.force_authenticate(user=other)

    r2 = api_client.get(f"/api/v1/bookings/{booking_id}/")
    assert r2.status_code == 404


# -----------------------------------------------------------------------------
# Matching engine
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_matching_engine_creates_proposal(rider_request, journey_plan):
    from apps.matching.services.matching_engine import find_matches_for_request

    count = find_matches_for_request(rider_request.id)
    assert count >= 1

    rider_request.refresh_from_db()
    assert rider_request.status == "MATCHED"

    assert MatchProposal.objects.filter(rider_request=rider_request).count() >= 1


@pytest.mark.django_db
def test_matching_engine_no_match_when_full(rider_request, journey_plan):
    from apps.matching.services.matching_engine import find_matches_for_request

    journey_plan.available_seats = 0
    journey_plan.status = "FULL"
    journey_plan.save()

    count = find_matches_for_request(rider_request.id)
    assert count == 0

    rider_request.refresh_from_db()
    assert rider_request.status == "NO_MATCH_FOUND"


# -----------------------------------------------------------------------------
# Journey lifecycle
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_journey_lifecycle(api_client, passenger, provider, proposal, journey_plan):
    _, _ = provider

    # Book to create the Journey
    api_client.force_authenticate(user=passenger)
    r = api_client.post("/api/v1/bookings/", {
        "proposal_id": str(proposal.id),
    }, format="json")
    journey = Journey.objects.get(journey_plan=journey_plan)

    # Provider starts it
    provider_user = journey_plan.provider.user
    api_client.force_authenticate(user=provider_user)

    r2 = api_client.post(f"/api/v1/journeys/{journey.id}/start/")
    assert r2.status_code == 200
    assert r2.data["status"] == "IN_PROGRESS"

    # Complete
    r3 = api_client.post(f"/api/v1/journeys/{journey.id}/complete/")
    assert r3.status_code == 200
    assert r3.data["status"] == "COMPLETED"

    # Cannot start again
    r4 = api_client.post(f"/api/v1/journeys/{journey.id}/start/")
    assert r4.status_code == 400

