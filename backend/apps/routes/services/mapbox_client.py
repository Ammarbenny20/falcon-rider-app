"""
Mapbox directions client. Falls back to a rough estimate when no token is set.
"""
import os
import requests

MAPBOX_TOKEN = os.environ.get("MAPBOX_ACCESS_TOKEN", "").strip()


def directions(origin, destination):
    if not MAPBOX_TOKEN:
        return _fallback_directions(origin, destination)

    url = (
        f"https://api.mapbox.com/directions/v5/mapbox/driving/"
        f"{origin['longitude']},{origin['latitude']};"
        f"{destination['longitude']},{destination['latitude']}"
    )
    params = {"access_token": MAPBOX_TOKEN, "geometries": "polyline", "overview": "full"}
    try:
        r = requests.get(url, params=params, timeout=8)
        r.raise_for_status()
        data = r.json()
        route = data["routes"][0]
        return {
            "distance_meters": int(route["distance"]),
            "duration_seconds": int(route["duration"]),
            "polyline": route["geometry"],
        }
    except Exception:
        return _fallback_directions(origin, destination)


def _fallback_directions(origin, destination):
    dx = abs(origin["longitude"] - destination["longitude"])
    dy = abs(origin["latitude"] - destination["latitude"])
    approx_km = (dx + dy) * 111
    return {
        "distance_meters": int(approx_km * 1000),
        "duration_seconds": int(approx_km * 90),
        "polyline": "",
    }
