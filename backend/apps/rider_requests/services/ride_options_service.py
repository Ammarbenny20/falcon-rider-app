"""
Ride options service.

Returns available transport modes with prices, ETAs, and seat availability.
Field name is `transport_mode` (not `mode`) per frontend contract.
"""

from math import radians, cos, sin, asin, sqrt


MODE_CATALOG = {
    "BODA": {
        "label": "Boda Boda",
        "supports_shared": False,
        "base_price": 1000,
        "per_km": 400,
        "driver_eta_seconds": 180,
        "avg_speed_kmh": 30,
    },
    "BAJAI": {
        "label": "Bajaji",
        "supports_shared": False,
        "base_price": 1500,
        "per_km": 500,
        "driver_eta_seconds": 240,
        "avg_speed_kmh": 25,
    },
    "CAR": {
        "label": "Car",
        "supports_shared": True,
        "base_price": 2000,
        "per_km": 700,
        "driver_eta_seconds": 240,
        "avg_speed_kmh": 30,
    },
    "VAN": {
        "label": "Van",
        "supports_shared": True,
        "base_price": 3000,
        "per_km": 900,
        "driver_eta_seconds": 300,
        "avg_speed_kmh": 35,
    },
    "BUS": {
        "label": "Bus",
        "supports_shared": True,
        "base_price": 500,
        "per_km": 200,
        "driver_eta_seconds": 600,
        "avg_speed_kmh": 25,
    },
}


def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return 2 * R * asin(sqrt(a))


def _available_seats_for_mode(mode: str):
    if mode in ("BODA", "BAJAI"):
        return None

    from apps.journey_plans.models import JourneyPlan
    transport_map = {"CAR": "CAR", "VAN": "BUS", "BUS": "BUS"}
    vehicle_type = transport_map.get(mode)
    if not vehicle_type:
        return 0

    total = (
        JourneyPlan.objects
        .filter(status="PUBLISHED", vehicle__transport_type=vehicle_type)
        .values_list("available_seats", flat=True)
    )
    return sum(total) or 0


def list_ride_options(origin: dict, destination: dict, when=None):
    lat1, lng1 = origin["latitude"], origin["longitude"]
    lat2, lng2 = destination["latitude"], destination["longitude"]
    distance_km = _haversine_km(lat1, lng1, lat2, lng2)

    options = []
    for mode, cfg in MODE_CATALOG.items():
        estimated_price = int(cfg["base_price"] + cfg["per_km"] * distance_km)
        trip_seconds = int((distance_km / cfg["avg_speed_kmh"]) * 3600) if distance_km > 0 else 0

        options.append({
            "transport_mode": mode,
            "label": cfg["label"],
            "supports_shared": cfg["supports_shared"],
            "estimated_price": estimated_price,
            "currency": "TZS",
            "driver_eta_seconds": cfg["driver_eta_seconds"],
            "trip_duration_seconds": trip_seconds,
            "available_seats": _available_seats_for_mode(mode),
        })

    return options


def availability_for_mode(mode: str):
    mode = (mode or "").upper()
    if mode not in MODE_CATALOG:
        return None
    return {
        "mode": mode,
        "available_seats": _available_seats_for_mode(mode),
    }
