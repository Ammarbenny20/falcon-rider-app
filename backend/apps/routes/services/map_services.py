from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone


@dataclass
class LocationResult:
    lat: float
    lng: float
    label: str


@dataclass
class RouteResult:
    distance_meters: int
    duration_min_seconds: int
    duration_max_seconds: int
    polyline: str = ""


class BaseMapProvider(ABC):
    @abstractmethod
    def geocode(self, address: str) -> list[LocationResult]: ...

    @abstractmethod
    def reverse_geocode(self, lat: float, lng: float) -> LocationResult: ...

    @abstractmethod
    def calculate_route(self, origin: tuple, destination: tuple) -> RouteResult: ...


class MapboxProvider(BaseMapProvider):
    """Real implementation — wraps Mapbox Directions/Geocoding APIs."""

    def __init__(self):
        self.api_key = settings.MAP_API_KEY

    def geocode(self, address: str) -> list[LocationResult]:
        import requests
        resp = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json",
            params={"access_token": self.api_key, "country": "TZ", "limit": 5},
            timeout=5,
        )
        resp.raise_for_status()
        features = resp.json().get("features", [])
        return [
            LocationResult(lat=f["center"][1], lng=f["center"][0], label=f["place_name"])
            for f in features
        ]

    def reverse_geocode(self, lat: float, lng: float) -> LocationResult:
        import requests
        resp = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json",
            params={"access_token": self.api_key},
            timeout=5,
        )
        resp.raise_for_status()
        features = resp.json().get("features", [])
        label = features[0]["place_name"] if features else "Unknown location"
        return LocationResult(lat=lat, lng=lng, label=label)

    def calculate_route(self, origin: tuple, destination: tuple) -> RouteResult:
        import requests
        coords = f"{origin[1]},{origin[0]};{destination[1]},{destination[0]}"
        resp = requests.get(
            f"https://api.mapbox.com/directions/v5/mapbox/driving/{coords}",
            params={"access_token": self.api_key, "overview": "full", "geometries": "polyline"},
            timeout=5,
        )
        resp.raise_for_status()
        route = resp.json()["routes"][0]
        duration = int(route["duration"])
        return RouteResult(
            distance_meters=int(route["distance"]),
            duration_min_seconds=int(duration * 0.85),
            duration_max_seconds=int(duration * 1.15),
            polyline=route.get("geometry", ""),
        )


def get_map_provider() -> BaseMapProvider:
    # Swap providers here (Google/OSM) without touching call sites.
    return MapboxProvider()


def calculate_eta(duration_seconds: int) -> datetime:
    return timezone.now() + timedelta(seconds=duration_seconds)