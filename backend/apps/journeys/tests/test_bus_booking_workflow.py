from datetime import date, time
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.accounts.models import User
from apps.bus_bookings.models import BusBooking, BusBookingStatus
from apps.bus_bookings.services import transition


class BusBookingWorkflowTests(TestCase):
    def setUp(self):
        self.organizer = User.objects.create_user(phone_number="+255700000060", role=User.Role.PASSENGER)
        self.admin = User.objects.create_user(phone_number="+255700000061", role=User.Role.ADMIN)
        self.booking = BusBooking.objects.create(
            organizer=self.organizer, contact_phone="+255700000060",
            pickup_label="UDSM", pickup_lat=0, pickup_lng=0,
            destination_label="Mbagala", destination_lat=0, destination_lng=0,
            travel_date=date.today(), departure_window_start=time(8, 0), departure_window_end=time(9, 0),
            passenger_count=40,
        )

    def test_full_happy_path(self):
        b = transition(self.booking.id, BusBookingStatus.REVIEWING, self.admin)
        b = transition(b.id, BusBookingStatus.BUS_ASSIGNED, self.admin)
        b = transition(b.id, BusBookingStatus.CONFIRMED, self.admin)
        b = transition(b.id, BusBookingStatus.READY_FOR_DEPARTURE, self.admin)
        b = transition(b.id, BusBookingStatus.VEHICLE_ARRIVING, self.admin)
        b = transition(b.id, BusBookingStatus.IN_PROGRESS, self.admin)
        b = transition(b.id, BusBookingStatus.COMPLETED, self.admin)
        self.assertEqual(b.status, BusBookingStatus.COMPLETED)

    def test_cannot_skip_to_confirmed(self):
        with self.assertRaises(ValidationError):
            transition(self.booking.id, BusBookingStatus.CONFIRMED, self.admin)

    def test_needs_action_path(self):
        b = transition(self.booking.id, BusBookingStatus.REVIEWING, self.admin)
        b = transition(b.id, BusBookingStatus.NEEDS_ACTION, self.admin)
        b = transition(b.id, BusBookingStatus.REVIEWING, self.admin)
        self.assertEqual(b.status, BusBookingStatus.REVIEWING)