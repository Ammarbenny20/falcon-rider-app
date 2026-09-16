import threading
from decimal import Decimal
from django.test import TransactionTestCase
from django.db import connections
from apps.accounts.models import User
from apps.providers.models import Provider, ProviderType, ProviderStatus, ProviderVerification, VerificationStatus
from apps.vehicles.models import Vehicle, VehicleStatus
from apps.journeys.models import Journey, TransportType
from apps.journeys.services import journey_service


class ConcurrencyTests(TransactionTestCase):
    """
    Uses TransactionTestCase (not TestCase) because select_for_update row
    locking requires real transactions committed across threads.
    """

    def setUp(self):
        self.passenger = User.objects.create_user(phone_number="+255700000020", role=User.Role.PASSENGER)
        self.providers = []
        for i in range(5):
            user = User.objects.create_user(phone_number=f"+25570000003{i}", role=User.Role.PROVIDER)
            provider = Provider.objects.create(
                user=user, provider_type=ProviderType.INDIVIDUAL_PROVIDER, status=ProviderStatus.ACTIVE
            )
            ProviderVerification.objects.create(provider=provider, status=VerificationStatus.APPROVED)
            Vehicle.objects.create(
                provider=provider, plate_number=f"T20{i} CCC", status=VehicleStatus.ACTIVE,
                verification_status=VerificationStatus.APPROVED, is_primary=True,
            )
            self.providers.append(provider)

        self.journey = Journey.objects.create(
            passenger=self.passenger, transport_type=TransportType.BODA_BODA,
            origin_label="UDSM", origin_lat=-6.78, origin_lng=39.20,
            destination_label="Posta", destination_lat=-6.81, destination_lng=39.29,
            fare_amount=Decimal("3500"),
        )

    def test_only_one_provider_wins_simultaneous_accept(self):
        results = []

        def try_accept(provider):
            try:
                journey_service.accept_journey(self.journey.id, provider)
                results.append(("success", provider.id))
            except Exception:
                results.append(("failed", provider.id))
            finally:
                connections.close_all()

        threads = [threading.Thread(target=try_accept, args=(p,)) for p in self.providers]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        successes = [r for r in results if r[0] == "success"]
        self.assertEqual(len(successes), 1, "Exactly one provider must win the race.")

        self.journey.refresh_from_db()
        self.assertEqual(self.journey.provider_id, successes[0][1])