import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User


@pytest.mark.django_db
def test_register_and_login():
    client = APIClient()

    r = client.post("/api/v1/auth/register/", {
        "email": "t1@test.local",
        "full_name": "T One",
        "password": "SecurePass123",
        "password_confirm": "SecurePass123",
    }, format="json")
    assert r.status_code == 200, r.content
    assert "token" in r.data
    assert r.data["user"]["email"] == "t1@test.local"

    r2 = client.post("/api/v1/auth/login/", {
        "identifier": "t1@test.local",
        "password": "SecurePass123",
    }, format="json")
    assert r2.status_code == 200
    assert r2.data["token"] == r.data["token"]


@pytest.mark.django_db
def test_wrong_password():
    User.objects.create_user(
        email="t2@test.local", full_name="T2", password="SecurePass123",
    )
    client = APIClient()
    r = client.post("/api/v1/auth/login/", {
        "identifier": "t2@test.local",
        "password": "wrong",
    }, format="json")
    assert r.status_code == 400
    assert r.data == {"detail": "Invalid credentials"}


@pytest.mark.django_db
def test_weak_password_rejected():
    client = APIClient()
    r = client.post("/api/v1/auth/register/", {
        "email": "t3@test.local",
        "full_name": "T3",
        "password": "abc",
        "password_confirm": "abc",
    }, format="json")
    assert r.status_code == 400
    assert "password" in r.data
