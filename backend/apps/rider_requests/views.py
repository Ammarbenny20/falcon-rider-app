from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsPassenger

from .models import RiderRequest
from .serializers import RiderRequestCreateSerializer, RiderRequestReadSerializer


def _get_passenger(request):
    return request.user.passenger_profile


def _enqueue_matching(rider_request_id):
    from apps.matching.services.matching_engine import find_matches_for_request
    from apps.matching.tasks.matching_tasks import find_matches_for_request as task
    try:
        task.delay(str(rider_request_id))
    except Exception:
        find_matches_for_request(rider_request_id)


class RiderRequestListCreateView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request):
        qs = RiderRequest.objects.filter(
            passenger=_get_passenger(request)
        ).order_by("-created_at")
        data = RiderRequestReadSerializer(qs, many=True).data
        return Response({
            "count": len(data), "next": None, "previous": None, "results": data,
        })

    def post(self, request):
        serializer = RiderRequestCreateSerializer(
            data=request.data,
            context={"passenger": _get_passenger(request)},
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Only auto-match for NOW rides; SCHEDULED waits for confirmation
        if instance.booking_type == "NOW":
            _enqueue_matching(instance.id)
            instance.refresh_from_db()

        return Response(
            RiderRequestReadSerializer(instance).data,
            status=status.HTTP_201_CREATED,
        )


class RiderRequestDetailView(APIView):
    permission_classes = [IsPassenger]

    def _get_object(self, request, pk):
        return RiderRequest.objects.get(pk=pk, passenger=_get_passenger(request))

    def get(self, request, pk):
        obj = self._get_object(request, pk)
        return Response(RiderRequestReadSerializer(obj).data)


class RiderRequestCancelView(APIView):
    permission_classes = [IsPassenger]

    def post(self, request, pk):
        obj = RiderRequest.objects.get(pk=pk, passenger=_get_passenger(request))
        obj.status = "CANCELLED"
        obj.cancel_reason = request.data.get("reason", "") or ""
        obj.save(update_fields=["status", "cancel_reason", "updated_at"])
        return Response(RiderRequestReadSerializer(obj).data)


class RiderRequestProposalsView(APIView):
    permission_classes = [IsPassenger]

    def get(self, request, pk):
        from apps.matching.models import MatchProposal
        from apps.matching.serializers import MatchProposalSerializer

        obj = RiderRequest.objects.get(pk=pk, passenger=_get_passenger(request))
        proposals = MatchProposal.objects.filter(rider_request=obj).order_by("-match_score")
        return Response(MatchProposalSerializer(proposals, many=True).data)
