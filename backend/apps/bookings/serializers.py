from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.journey_plans.models import JourneyPlan
from apps.journeys.models import Journey
from apps.matching.models import MatchProposal

from .models import Booking, SharedCost


class BookingReadSerializer(serializers.ModelSerializer):
    match_proposal_id = serializers.UUIDField(source="match_proposal.id", read_only=True)
    passenger_id = serializers.UUIDField(source="passenger.id", read_only=True)
    journey_plan_id = serializers.UUIDField(source="journey_plan.id", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "match_proposal_id", "passenger_id", "journey_plan_id",
            "seats_booked", "status", "confirmed_at", "cancelled_at",
            "cancel_reason", "created_at",
        ]


class BookingCreateSerializer(serializers.Serializer):
    proposal_id = serializers.UUIDField()

    def validate(self, attrs):
        passenger = self.context["passenger"]
        try:
            proposal = MatchProposal.objects.select_related("journey_plan").get(
                pk=attrs["proposal_id"]
            )
        except MatchProposal.DoesNotExist:
            raise serializers.ValidationError({"proposal_id": ["Proposal not found."]})

        if proposal.rider_request.passenger_id != passenger.id:
            raise serializers.ValidationError(
                {"proposal_id": ["This proposal is not yours."]}
            )
        if proposal.status != "PROPOSED":
            raise serializers.ValidationError(
                {"proposal_id": ["Proposal is no longer available."]}
            )

        attrs["proposal"] = proposal
        attrs["seats"] = proposal.rider_request.seats_needed
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        proposal = validated_data["proposal"]
        seats = validated_data["seats"]
        passenger = self.context["passenger"]

        # B2: lock the JourneyPlan row so concurrent bookings can't oversell
        plan = JourneyPlan.objects.select_for_update().get(
            pk=proposal.journey_plan_id
        )

        if plan.available_seats < seats:
            raise serializers.ValidationError(
                {"detail": "Not enough seats available."}
            )

        booking = Booking.objects.create(
            match_proposal=proposal,
            passenger=passenger,
            journey_plan=plan,
            seats_booked=seats,
            status="CONFIRMED",
            confirmed_at=timezone.now(),
        )

        # Create the SharedCost record
        base_fare = plan.price_per_seat * seats
        platform_fee = 0
        total = base_fare + platform_fee

        SharedCost.objects.create(
            booking=booking,
            base_fare=base_fare,
            distance_cost=0,
            time_cost=0,
            platform_fee=platform_fee,
            discount_amount=0,
            total_amount=total,
            currency="TZS",
            payment_status="PENDING",
        )

        # Flip proposal → ACCEPTED
        proposal.status = "ACCEPTED"
        proposal.save(update_fields=["status"])

        # Decrement seats; flip plan to FULL if empty
        plan.available_seats = plan.available_seats - seats
        if plan.available_seats == 0:
            plan.status = "FULL"
        plan.save(update_fields=["available_seats", "status", "updated_at"])

        # A3: auto-create the Journey row so live tracking can begin
        Journey.objects.get_or_create(
            journey_plan=plan,
            defaults={"status": "NOT_STARTED"},
        )

        # Payouts: create a ProviderEarning with the 15% platform commission
        try:
            from apps.payouts.services import create_earning_for_booking
            create_earning_for_booking(booking)
        except Exception:
            pass

        return booking


class SharedCostSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(source="booking.id", read_only=True)

    class Meta:
        model = SharedCost
        fields = [
            "id", "booking_id", "base_fare", "distance_cost", "time_cost",
            "platform_fee", "discount_amount", "total_amount", "currency",
            "payment_status",
        ]
