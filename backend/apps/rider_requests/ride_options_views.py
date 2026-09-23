from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services.ride_options_service import availability_for_mode, list_ride_options


def _parse_float(value, field_name):
    if value is None or value == "":
        raise ValueError(f"{field_name} is required")
    return float(value)


class RideOptionsView(APIView):
    def get(self, request):
        params = request.query_params
        try:
            origin = {
                "latitude": _parse_float(params.get("origin_lat"), "origin_lat"),
                "longitude": _parse_float(params.get("origin_lng"), "origin_lng"),
            }
            destination = {
                "latitude": _parse_float(params.get("dest_lat"), "dest_lat"),
                "longitude": _parse_float(params.get("dest_lng"), "dest_lng"),
            }
        except (ValueError, TypeError) as exc:
            return Response(
                {"detail": f"Invalid query: {exc}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        when = params.get("when")
        options = list_ride_options(origin, destination, when=when)
        return Response({"options": options})


class RideOptionAvailabilityView(APIView):
    def get(self, request, mode):
        result = availability_for_mode(mode)
        if result is None:
            return Response(
                {"detail": f"Unknown mode: {mode}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        result["updated_at"] = timezone.now().isoformat()
        return Response(result)
