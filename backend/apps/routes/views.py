from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.routes.services.map_service import get_map_provider
from apps.routes.models import Route


class GeocodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q", "")
        if not query:
            return Response({"results": []})
        results = get_map_provider().geocode(query)
        return Response({"results": [r.__dict__ for r in results]})


class RouteCalculateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        origin = request.data["origin"]  # {lat, lng}
        destination = request.data["destination"]

        route_result = get_map_provider().calculate_route(
            (float(origin["lat"]), float(origin["lng"])),
            (float(destination["lat"]), float(destination["lng"])),
        )
        Route.objects.create(
            origin_lat=origin["lat"], origin_lng=origin["lng"],
            destination_lat=destination["lat"], destination_lng=destination["lng"],
            distance_meters=route_result.distance_meters,
            duration_min_seconds=route_result.duration_min_seconds,
            duration_max_seconds=route_result.duration_max_seconds,
            polyline=route_result.polyline,
        )
        return Response({
            "distance_meters": route_result.distance_meters,
            "duration_min_seconds": route_result.duration_min_seconds,
            "duration_max_seconds": route_result.duration_max_seconds,
            "polyline": route_result.polyline,
        })