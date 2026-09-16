from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.accounts.models import User


class AuthTests(APITestCase):
    def _create_user(self, role, phone="+255700000001"):
        return User.objects.create_user(phone_number=phone, role=role, password="unused")

    def test_passenger_cannot_access_admin_overview(self):
        user = self._create_user(User.Role.PASSENGER)
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/admin/overview/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_provider_cannot_access_admin_overview(self):
        user = self._create_user(User.Role.PROVIDER, phone="+255700000002")
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/admin/overview/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_access_admin_overview(self):
        user = self._create_user(User.Role.ADMIN, phone="+255700000003")
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/admin/overview/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_request_rejected(self):
        response = self.client.get("/api/journeys/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)