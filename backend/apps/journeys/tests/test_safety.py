from django.test import TestCase
from apps.accounts.models import User
from apps.journeys.models import Journey, TransportType
from apps.safety.models import SafetyIncident


class SafetyIncidentTests(TestCase):
    def setUp(self):
        self.passenger = User.objects.create_user(phone_number="+255700000070", role=User.Role.PASSENGER)
        self.journey = Journey.objects.create(
            passenger=self.passenger, transport_type=TransportType.CAR,
            origin_label="A", origin_lat=0, origin_lng=0,
            destination_label="B", destination_lat=0, destination_lng=0,
        )

    def test_create_incident_links_journey_and_passenger(self):
        incident = SafetyIncident.objects.create(
            journey=self.journey, reported_by=self.passenger, passenger=self.passenger,
            category="DRIVER_BEHAVIOR", description="Speeding.",
        )
        self.assertEqual(incident.status, "REPORTED")
        self.assertEqual(incident.journey, self.journey)

    def test_resolve_incident(self):
        incident = SafetyIncident.objects.create(
            journey=self.journey, reported_by=self.passenger, passenger=self.passenger,
            category="OTHER", description="Test",
        )
        incident.status = "RESOLVED"
        incident.resolution_notes = "Investigated, no action needed."
        incident.save()
        self.assertEqual(incident.status, "RESOLVED")