from decimal import Decimal
from django.test import TestCase, override_settings
from apps.accounts.models import User
from apps.providers.models import Provider, ProviderType, ProviderStatus
from apps.journeys.models import Journey, TransportType, JourneyStatus
from apps.payments.models import Payment, PaymentStatus
from apps.payments.services import settle_journey_payment


class PaymentTests(TestCase):
    def setUp(self):
        self.passenger = User.objects.create_user(phone_number="+255700000050", role=User.Role.PASSENGER)
        provider_user = User.objects.create_user(phone_number="+255700000051", role=User.Role.PROVIDER)
        self.provider = Provider.objects.create(
            user=provider_user, provider_type=ProviderType.INDIVIDUAL_PROVIDER, status=ProviderStatus.ACTIVE
        )
        self.journey = Journey.objects.create(
            passenger=self.passenger, provider=self.provider, transport_type=TransportType.CAR,
            status=JourneyStatus.COMPLETED,
            origin_label="A", origin_lat=0, origin_lng=0,
            destination_label="B", destination_lat=0, destination_lng=0,
            fare_amount=Decimal("10000"),
        )

    @override_settings(PLATFORM_COMMISSION_PERCENT=15)
    def test_commission_applied_from_settings(self):
        payment = settle_journey_payment(self.journey)
        self.assertEqual(payment.platform_fee_amount, Decimal("1500.00"))
        self.assertEqual(payment.provider_earning_amount, Decimal("8500.00"))
        self.assertEqual(payment.status, PaymentStatus.SUCCESSFUL)

    def test_duplicate_settlement_does_not_double_charge(self):
        settle_journey_payment(self.journey)
        settle_journey_payment(self.journey)  # retry, e.g. network retry on client
        self.assertEqual(Payment.objects.filter(journey=self.journey).count(), 1)

    def test_settlement_fails_without_fare(self):
        self.journey.fare_amount = None
        self.journey.save()
        with self.assertRaises(ValueError):
            settle_journey_payment(self.journey)