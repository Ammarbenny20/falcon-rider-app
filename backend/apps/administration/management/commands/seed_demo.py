import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import User
from apps.providers.models import Provider, ProviderType, ProviderStatus, ProviderVerification, VerificationStatus
from apps.vehicles.models import Vehicle, VehicleStatus
from apps.journeys.models import Journey, JourneyStatus, TransportType
from apps.payments.services import settle_journey_payment

LOCATIONS = [
    ("UDSM", -6.7810, 39.2087), ("Mlimani City", -6.7736, 39.2094),
    ("Ubungo", -6.8079, 39.2317), ("Kimara", -6.7852, 39.1927),
    ("Mbezi", -6.7397, 39.1447), ("Kariakoo", -6.8181, 39.2694),
    ("Posta", -6.8140, 39.2905), ("Sinza", -6.7776, 39.2333),
    ("Mwenge", -6.7659, 39.2263), ("Masaki", -6.7481, 39.2874),
]


class Command(BaseCommand):
    help = "Seed fictional demo data for local development. NOT real traffic."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Seeding DEMO data — not real Falcon Rider traction."))

        passengers = [
            User.objects.get_or_create(
                phone_number=f"+25571000{i:04d}", defaults={"role": User.Role.PASSENGER, "full_name": f"Demo Passenger {i}"}
            )[0]
            for i in range(1, 11)
        ]

        providers = []
        for i in range(1, 6):
            user, _ = User.objects.get_or_create(
                phone_number=f"+25576000{i:04d}", defaults={"role": User.Role.PROVIDER, "full_name": f"Demo Provider {i}"}
            )
            provider, _ = Provider.objects.get_or_create(
                user=user, defaults={
                    "provider_type": ProviderType.INDIVIDUAL_PROVIDER,
                    "status": ProviderStatus.ACTIVE,
                    "is_online": True,
                    "current_lat": LOCATIONS[i % len(LOCATIONS)][1],
                    "current_lng": LOCATIONS[i % len(LOCATIONS)][2],
                    "location_updated_at": timezone.now(),
                    "is_location_simulated": True,
                }
            )
            ProviderVerification.objects.get_or_create(
                provider=provider, defaults={"status": VerificationStatus.APPROVED, "reviewed_at": timezone.now()}
            )
            Vehicle.objects.get_or_create(
                provider=provider, plate_number=f"T{100+i} DEM",
                defaults={
                    "vehicle_type": random.choice([TransportType.BODA_BODA, TransportType.BAJAJI, TransportType.CAR]),
                    "status": VehicleStatus.ACTIVE,
                    "verification_status": VerificationStatus.APPROVED,
                    "is_primary": True,
                    "capacity": 1,
                }
            )
            providers.append(provider)

        for i in range(20):
            origin = random.choice(LOCATIONS)
            destination = random.choice([l for l in LOCATIONS if l != origin])
            journey = Journey.objects.create(
                passenger=random.choice(passengers),
                provider=random.choice(providers),
                transport_type=random.choice(TransportType.values),
                status=JourneyStatus.COMPLETED,
                origin_label=origin[0], origin_lat=origin[1], origin_lng=origin[2],
                destination_label=destination[0], destination_lat=destination[1], destination_lng=destination[2],
                fare_amount=Decimal(random.choice([3500, 4000, 5500, 8000])),
                completed_at=timezone.now(),
            )
            settle_journey_payment(journey)

        self.stdout.write(self.style.SUCCESS("Demo seed complete."))