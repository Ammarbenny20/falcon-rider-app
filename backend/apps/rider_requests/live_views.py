from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsPassenger

from .models import RiderRequest


class RiderRequestLiveView(APIView):
    """
    GET /api/v1/rider-requests/{id}/live/

    Returns the live status of a rider request so the frontend can poll
    while waiting for a match. Includes:

    - status: the current RiderRequest.status
    - driver: null (until a match is accepted; populated in Phase 3)
    - eta_seconds: null (until a driver is en route)
    """

    permission_classes = [IsPassenger]

    def get(self, request, pk):
        passenger = request.user.passenger_profile
        try:
            rr = RiderRequest.objects.get(pk=pk, passenger=passenger)
        except RiderRequest.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        # Find the top match, if any
        top_match = None
        try:
            from apps.matching.models import MatchProposal
            top = (
                MatchProposal.objects
                .filter(rider_request=rr, status__in=["PROPOSED", "ACCEPTED"])
                .order_by("-match_score")
                .select_related("journey_plan__provider__user", "journey_plan__vehicle")
                .first()
            )
            if top:
                plan = top.journey_plan
                provider_user = plan.provider.user
                top_match = {
                    "id": str(plan.provider.id),
                    "name": provider_user.full_name,
                    "rating": str(plan.provider.rating),
                    "vehicle": {
                        "make": plan.vehicle.make,
                        "model": plan.vehicle.model,
                        "color": plan.vehicle.color,
                        "license_plate": plan.vehicle.license_plate,
                    },
                }
        except Exception:
            pass

        # ETA — for MVP, only populated once the driver is en route.
        # For now, return None (state-level).
        eta_seconds = None

        return Response({
            "status": rr.status,
            "driver": top_match,
            "eta_seconds": eta_seconds,
        })
