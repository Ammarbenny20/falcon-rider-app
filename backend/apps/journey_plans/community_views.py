from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsPassenger, IsProvider

from apps.bookings.models import Booking, SharedCost
from apps.matching.models import MatchProposal
from apps.payouts.services import create_earning_for_booking

from .models import JourneyPlan
from .serializers import JourneyPlanCreateSerializer, JourneyPlanReadSerializer


def _get_provider(request):
    return request.user.provider_profile


class CommunityJourneyListCreateView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        qs = JourneyPlan.objects.filter(
            provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        ).order_by("-created_at")
        return Response(JourneyPlanReadSerializer(qs, many=True).data)

    def post(self, request):
        data = dict(request.data)
        data["journey_type"] = "COMMUNITY_JOURNEY"
        serializer = JourneyPlanCreateSerializer(
            data=data,
            context={"provider": _get_provider(request)},
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        if obj.journey_type != "COMMUNITY_JOURNEY":
            obj.journey_type = "COMMUNITY_JOURNEY"
            obj.save(update_fields=["journey_type"])
        return Response(JourneyPlanReadSerializer(obj).data, status=status.HTTP_201_CREATED)


class CommunityJourneyDetailView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        )
        return Response(JourneyPlanReadSerializer(obj).data)

    def patch(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        )
        for field in ("total_seats", "available_seats", "price_per_seat", "status"):
            if field in request.data:
                setattr(obj, field, request.data[field])
        obj.save()
        return Response(JourneyPlanReadSerializer(obj).data)


class CommunityJourneyCancelView(APIView):
    permission_classes = [IsProvider]

    def post(self, request, pk):
        obj = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        )
        obj.status = "CANCELLED"
        obj.save(update_fields=["status", "updated_at"])
        return Response(JourneyPlanReadSerializer(obj).data)


class CommunityJourneyRequestsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request, pk):
        plan = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        )
        proposals = MatchProposal.objects.filter(journey_plan=plan).order_by("-created_at")
        return Response([
            {
                "id": str(p.id),
                "rider_request_id": str(p.rider_request.id),
                "passenger_id": str(p.rider_request.passenger.id),
                "passenger_name": p.rider_request.passenger.user.full_name,
                "status": p.status,
                "match_score": str(p.match_score),
                "proposed_fare_share": str(p.proposed_fare_share),
                "created_at": p.created_at.isoformat(),
            }
            for p in proposals
        ])


class CommunityJourneyRequestDecisionView(APIView):
    permission_classes = [IsProvider]

    def post(self, request, pk, rid, action):
        plan = get_object_or_404(
            JourneyPlan, pk=pk, provider=_get_provider(request),
            journey_type="COMMUNITY_JOURNEY",
        )
        proposal = get_object_or_404(MatchProposal, pk=rid, journey_plan=plan)

        if proposal.status != "PROPOSED":
            return Response(
                {"detail": f"Proposal is {proposal.status}, cannot act."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "accept":
            proposal.status = "ACCEPTED"
        elif action == "reject":
            proposal.status = "REJECTED"
        else:
            return Response({"detail": "Invalid action."}, status=400)

        proposal.save(update_fields=["status"])
        return Response({"id": str(proposal.id), "status": proposal.status})


class CommunityJourneyJoinView(APIView):
    permission_classes = [IsPassenger]

    def post(self, request, pk):
        plan = get_object_or_404(
            JourneyPlan, pk=pk, journey_type="COMMUNITY_JOURNEY",
        )

        if plan.status != "PUBLISHED":
            return Response(
                {"detail": f"Plan is {plan.status}, cannot join."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if plan.gender_restriction == "FEMALE_ONLY" and request.user.gender != "FEMALE":
            return Response(
                {"detail": "This journey is reserved for female passengers only."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if plan.gender_restriction == "MALE_ONLY" and request.user.gender != "MALE":
            return Response(
                {"detail": "This journey is reserved for male passengers only."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            seats = int(request.data.get("seats", 1))
        except (TypeError, ValueError):
            return Response({"detail": "seats must be an integer."}, status=400)

        if seats < 1:
            return Response({"detail": "seats must be at least 1."}, status=400)

        with transaction.atomic():
            locked = JourneyPlan.objects.select_for_update().get(pk=plan.pk)
            if locked.available_seats < seats:
                return Response(
                    {"detail": "Not enough seats available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            booking = Booking.objects.create(
                match_proposal=None,
                passenger=request.user.passenger_profile,
                journey_plan=locked,
                seats_booked=seats,
                status="CONFIRMED",
                confirmed_at=timezone.now(),
            )

            base_fare = locked.price_per_seat * seats
            SharedCost.objects.create(
                booking=booking,
                base_fare=base_fare,
                distance_cost=0,
                time_cost=0,
                platform_fee=0,
                discount_amount=0,
                total_amount=base_fare,
                currency="TZS",
                payment_status="PENDING",
            )

            # Payouts: create a ProviderEarning with the 15% platform commission
            try:
                create_earning_for_booking(booking)
            except Exception:
                pass

            locked.available_seats -= seats
            if locked.available_seats == 0:
                locked.status = "FULL"
            locked.save(update_fields=["available_seats", "status", "updated_at"])

        return Response({
            "booking_id": str(booking.id),
            "journey_plan_id": str(locked.id),
            "seats_booked": seats,
            "status": booking.status,
        }, status=status.HTTP_201_CREATED)
