"""
Seed demo data for Falcon Rider.

Creates:
- 5 demo providers (drivers)
- 5 demo vehicles
- 10 demo customers (passengers)

Usage:
    python manage.py seed_demo
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import (
    User, UserRole, UserStatus,
    PassengerProfile, ProviderProfile,
    ProviderVerificationStatus, ProfessionalAvailability,
)
from apps.vehicles.models import Vehicle, TransportType


DEMO_PROVIDERS = [
    {
        "email": "driver1@falconrider.com",
        "phone": "+255700000101",
        "full_name": "Juma Mwakalinga",
        "vehicle": {
            "transport_type": TransportType.BODA_BODA,
            "make": "Honda",
            "model": "CB125",
            "year": 2022,
            "license_plate": "MC 101 ABC",
            "capacity": 1,
            "color": "Red",
        },
    },
    {
        "email": "driver2@falconrider.com",
        "phone": "+255700000102",
        "full_name": "Baraka Nyerere",
        "vehicle": {
            "transport_type": TransportType.BAJAI,
            "make": "Bajaj",
            "model": "RE",
            "year": 2021,
            "license_plate": "MC 102 ABC",
            "capacity": 3,
            "color": "Yellow",
        },
    },
    {
        "email": "driver3@falconrider.com",
        "phone": "+255700000103",
        "full_name": "Grace Mushi",
        "vehicle": {
            "transport_type": TransportType.CAR,
            "make": "Toyota",
            "model": "Corolla",
            "year": 2020,
            "license_plate": "T 103 ABC",
            "capacity": 4,
            "color": "White",
        },
    },
    {
        "email": "driver4@falconrider.com",
        "phone": "+255700000104",
        "full_name": "Fatuma Hassan",
        "vehicle": {
            "transport_type": TransportType.CAR,
            "make": "Nissan",
            "model": "Note",
            "year": 2019,
            "license_plate": "T 104 ABC",
            "capacity": 4,
            "color": "Silver",
        },
    },
    {
        "email": "driver5@falconrider.com",
        "phone": "+255700000105",
        "full_name": "Ramadhani Kileo",
        "vehicle": {
            "transport_type": TransportType.BUS,
            "make": "Toyota",
            "model": "Coaster",
            "year": 2018,
            "license_plate": "T 105 ABC",
            "capacity": 30,
            "color": "Blue",
        },
    },
]


DEMO_CUSTOMERS = [
    {"email": "customer1@falconrider.com", "phone": "+255700000201", "full_name": "John Mwangi"},
    {"email": "customer2@falconrider.com", "phone": "+255700000202", "full_name": "Amina Said"},
    {"email": "customer3@falconrider.com", "phone": "+255700000203", "full_name": "David Kimaro"},
    {"email": "customer4@falconrider.com", "phone": "+255700000204", "full_name": "Neema Joseph"},
    {"email": "customer5@falconrider.com", "phone": "+255700000205", "full_name": "Halima Mwinyi"},
]


class Command(BaseCommand):
    help = "Seed demo data for Falcon Rider"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Seeding demo data..."))
        self.stdout.write("")

        # PROVIDERS
        created_providers = 0
        for p in DEMO_PROVIDERS:
            user, created = User.objects.get_or_create(
                email=p["email"],
                defaults={
                    "phone_number": p["phone"],
                    "full_name": p["full_name"],
                    "role": UserRole.PROVIDER,
                    "status": UserStatus.ACTIVE,
                    "is_verified": True,
                    "is_active": True,
                },
            )

            if created:
                user.set_password("Test1234!")
                user.save()

                profile, _ = ProviderProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "verification_status": ProviderVerificationStatus.VERIFIED,
                        "professional_availability": ProfessionalAvailability.ONLINE,
                    },
                )

                v = p["vehicle"]
                Vehicle.objects.get_or_create(
                    provider=profile,
                    license_plate=v["license_plate"],
                    defaults={
                        "transport_type": v["transport_type"],
                        "make": v["make"],
                        "model": v["model"],
                        "year": v["year"],
                        "capacity": v["capacity"],
                        "color": v["color"],
                        "is_active": True,
                    },
                )

                created_providers += 1
                self.stdout.write(f"  OK Provider: {p['full_name']} ({p['email']})")

        # CUSTOMERS
        created_customers = 0
        for c in DEMO_CUSTOMERS:
            user, created = User.objects.get_or_create(
                email=c["email"],
                defaults={
                    "phone_number": c["phone"],
                    "full_name": c["full_name"],
                    "role": UserRole.PASSENGER,
                    "status": UserStatus.ACTIVE,
                    "is_verified": True,
                    "is_active": True,
                },
            )

            if created:
                user.set_password("Test1234!")
                user.save()
                PassengerProfile.objects.get_or_create(user=user)
                created_customers += 1
                self.stdout.write(f"  OK Customer: {c['full_name']} ({c['email']})")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"Providers: {created_providers}"))
        self.stdout.write(self.style.SUCCESS(f"Customers: {created_customers}"))
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Demo data imejazwa!"))
        self.stdout.write("")
        self.stdout.write("Credentials:")
        self.stdout.write("  Providers: driver1-5@falconrider.com / Test1234!")
        self.stdout.write("  Customers: customer1-5@falconrider.com / Test1234!")
        self.stdout.write("")
