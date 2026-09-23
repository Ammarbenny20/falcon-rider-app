from rest_framework.response import Response
from rest_framework.views import APIView

from .services.geocoding_service import geocode
from .services.mapbox_client import directions


class GeocodeView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "")
        return Response({"results": geocode(q)})


class DirectionsView(APIView):
    def post(self, request):
        origin = request.data.get("origin", {})
        destination = request.data.get("destination", {})
        return Response(directions(origin, destination))
