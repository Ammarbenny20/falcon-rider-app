"""
Sanity tests for Session 2 endpoints.
"""
import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User, ProviderProfile


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin_t@test.local",
        full_name="Admin T",
        password="AdminPass123",
        role="ADMIN",
    )


@pytest.fixture
def passenger_user(db):
    u = User.objects.create_user(
        email="pass_t@test.local",
        full_name="Pass T",
        password="PassPass123",
        role="PASSENGER",
    )
    from apps.accounts.models import PassengerProfile
    PassengerProfile.objects.get_or_create(user=u)
    return u


@pytest.fixture
def provider_user(db):
    u = User.objects.create_user(
        email="prov_t@test.local",
        full_name="Prov T",
        password="ProvPass123",
        role="PROVIDER",
    )
    ProviderProfile.objects.get_or_create(
        user=u,
        defaults={
            "verification_status": "VERIFIED",
            "vehicle_type": "CAR",
            "capabilities": ["PROFESSIONAL_SERVICE"],
            "capability_status": {"PROFESSIONAL_SERVICE": "APPROVED"},
        },
    )
    return u


# -----------------------------------------------------------------------------
# Health check
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_health_endpoint(api_client):
    r = api_client.get("/health/")
    assert r.status_code == 200
    import json
    body = json.loads(r.content)
    assert body == {"status": "ok"}


# -----------------------------------------------------------------------------
# Provider registration
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_provider_register(api_client, passenger_user):
    api_client.force_authenticate(user=passenger_user)
    r = api_client.post("/api/v1/provider/register/", {
        "vehicle_type": "CAR",
        "license_number": "LIC-TEST",
        "capabilities": ["PROFESSIONAL_SERVICE"],
        "vehicle_details": {
            "make": "Toyota",
            "model": "Vitz",
            "plate_number": "TTEST001",
            "color": "Red",
            "capacity": 4,
            "year": 2020,
        },
    }, format="json")
    assert r.status_code == 201, r.content
    assert r.data["status"] == "PENDING_VERIFICATION"
    assert r.data["vehicle"]["plate_number"] == "TTEST001"

    # User's role upgraded
    passenger_user.refresh_from_db()
    assert passenger_user.role == "PROVIDER"

    # ProviderProfile created
    assert ProviderProfile.objects.filter(user=passenger_user).exists()


@pytest.mark.django_db
def test_provider_register_already_provider(api_client, provider_user):
    api_client.force_authenticate(user=provider_user)
    r = api_client.post("/api/v1/provider/register/", {
        "vehicle_type": "CAR",
    }, format="json")
    assert r.status_code == 400
    assert "already registered" in str(r.data).lower()


# -----------------------------------------------------------------------------
# Vehicle CRUD
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_vehicle_create_and_list(api_client, provider_user):
    api_client.force_authenticate(user=provider_user)

    # Create
    r = api_client.post("/api/v1/vehicles/", {
        "transport_type": "CAR",
        "make": "Suzuki",
        "model": "Swift",
        "year": 2022,
        "license_plate": "TVEH01",
        "capacity": 4,
        "color": "White",
        "is_active": True,
    }, format="json")
    assert r.status_code == 201, r.content
    vehicle_id = r.data["id"]
    assert r.data["license_plate"] == "TVEH01"

    # List
    r2 = api_client.get("/api/v1/vehicles/")
    assert r2.status_code == 200
    assert r2.data["count"] >= 1

    # Detail
    r3 = api_client.get(f"/api/v1/vehicles/{vehicle_id}/")
    assert r3.status_code == 200
    assert r3.data["license_plate"] == "TVEH01"


@pytest.mark.django_db
def test_vehicle_unique_plate(api_client, provider_user):
    api_client.force_authenticate(user=provider_user)

    payload = {
        "transport_type": "CAR",
        "make": "Mazda",
        "model": "Demio",
        "year": 2019,
        "license_plate": "TDUP01",
        "capacity": 4,
        "color": "Black",
        "is_active": True,
    }

    r1 = api_client.post("/api/v1/vehicles/", payload, format="json")
    assert r1.status_code == 201

    r2 = api_client.post("/api/v1/vehicles/", payload, format="json")
    assert r2.status_code == 400
    assert "license_plate" in r2.data


# -----------------------------------------------------------------------------
# Ownership on vehicles
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_vehicle_ownership_isolation(api_client, provider_user, passenger_user):
    """
    A second provider cannot see or modify another provider's vehicle.
    """
    # provider_user creates a vehicle
    api_client.force_authenticate(user=provider_user)
    r = api_client.post("/api/v1/vehicles/", {
        "transport_type": "CAR",
        "make": "Nissan",
        "model": "Note",
        "year": 2021,
        "license_plate": "TOWN01",
        "capacity": 4,
        "color": "Grey",
        "is_active": True,
    }, format="json")
    vehicle_id = r.data["id"]

    # Make a second provider
    other = User.objects.create_user(
        email="prov2_t@test.local",
        full_name="Prov 2",
        password="ProvPass123",
        role="PROVIDER",
    )
    ProviderProfile.objects.create(
        user=other,
        verification_status="VERIFIED",
        vehicle_type="CAR",
    )

    api_client.force_authenticate(user=other)
    r2 = api_client.get(f"/api/v1/vehicles/{vehicle_id}/")
    assert r2.status_code == 404  # not visible to other providers


# -----------------------------------------------------------------------------
# Analytics access control
# -----------------------------------------------------------------------------
@pytest.mark.django_db
def test_analytics_requires_admin(api_client, passenger_user):
    api_client.force_authenticate(user=passenger_user)
    r = api_client.get("/api/v1/admin/analytics/")
    assert r.status_code == 403


@pytest.mark.django_db
def test_analytics_returns_for_admin(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    r = api_client.get("/api/v1/admin/analytics/")
    assert r.status_code == 200
    assert "users" in r.data
    assert "providers" in r.data
