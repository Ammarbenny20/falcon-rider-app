"""
Geocoding service.

Response shape (frozen contract):
    {
        "id": "<stable string>",
        "name": "Mlimani City",
        "address": "Sam Nujoma Road, Dar es Salaam",
        "latitude": -6.7723,
        "longitude": 39.2226
    }

Uses Mapbox when MAPBOX_ACCESS_TOKEN is set; otherwise falls back to a
keyword-based stub for dev with Tanzanian places.
"""
import hashlib
import os
import urllib.parse
import requests

MAPBOX_TOKEN = os.environ.get("MAPBOX_ACCESS_TOKEN", "").strip()

# Dev stub — Tanzanian places (Dar es Salaam, Arusha, Mwanza, Dodoma, Mbeya)
DEMO_RESULTS = {
    # ─────────────────────────────────────────
    # DAR ES SALAAM
    # ─────────────────────────────────────────
    "mbezi": {
        "name": "Mbezi Beach",
        "address": "Mbezi Beach, Dar es Salaam",
        "latitude": -6.7500,
        "longitude": 39.2600,
    },
    "posta": {
        "name": "Posta",
        "address": "Azikiwe Street, Dar es Salaam",
        "latitude": -6.8167,
        "longitude": 39.2894,
    },
    "kariakoo": {
        "name": "Kariakoo Market",
        "address": "Kariakoo, Dar es Salaam",
        "latitude": -6.7924,
        "longitude": 39.2083,
    },
    "ubungo": {
        "name": "Ubungo",
        "address": "Ubungo, Dar es Salaam",
        "latitude": -6.7860,
        "longitude": 39.2200,
    },
    "kigamboni": {
        "name": "Kigamboni",
        "address": "Kigamboni, Dar es Salaam",
        "latitude": -6.8300,
        "longitude": 39.3100,
    },
    "kinondoni": {
        "name": "Kinondoni",
        "address": "Kinondoni, Dar es Salaam",
        "latitude": -6.7930,
        "longitude": 39.2600,
    },
    "tabata": {
        "name": "Tabata",
        "address": "Tabata, Dar es Salaam",
        "latitude": -6.8300,
        "longitude": 39.2300,
    },
    "airport": {
        "name": "Julius Nyerere International Airport",
        "address": "Nyerere Road, Dar es Salaam",
        "latitude": -6.8781,
        "longitude": 39.2026,
    },
    "mwenge": {
        "name": "Mwenge",
        "address": "Mwenge, Dar es Salaam",
        "latitude": -6.7700,
        "longitude": 39.2400,
    },
    "mikocheni": {
        "name": "Mikocheni",
        "address": "Mikocheni, Dar es Salaam",
        "latitude": -6.7700,
        "longitude": 39.2600,
    },
    "mlimani": {
        "name": "Mlimani City",
        "address": "Sam Nujoma Road, Dar es Salaam",
        "latitude": -6.8235,
        "longitude": 39.2695,
    },
    "upanga": {
        "name": "Upanga",
        "address": "Upanga, Dar es Salaam",
        "latitude": -6.8050,
        "longitude": 39.2800,
    },
    "magomeni": {
        "name": "Magomeni",
        "address": "Magomeni, Dar es Salaam",
        "latitude": -6.8050,
        "longitude": 39.2600,
    },
    "ilala": {
        "name": "Ilala",
        "address": "Ilala, Dar es Salaam",
        "latitude": -6.8200,
        "longitude": 39.2700,
    },
    "temeke": {
        "name": "Temeke",
        "address": "Temeke, Dar es Salaam",
        "latitude": -6.8500,
        "longitude": 39.2800,
    },
    "msasani": {
        "name": "Msasani",
        "address": "Msasani, Dar es Salaam",
        "latitude": -6.7500,
        "longitude": 39.2800,
    },
    "oysterbay": {
        "name": "Oyster Bay",
        "address": "Oyster Bay, Dar es Salaam",
        "latitude": -6.7600,
        "longitude": 39.2800,
    },
    "masaki": {
        "name": "Masaki",
        "address": "Masaki, Dar es Salaam",
        "latitude": -6.7500,
        "longitude": 39.2750,
    },
    "sinza": {
        "name": "Sinza",
        "address": "Sinza, Dar es Salaam",
        "latitude": -6.7800,
        "longitude": 39.2400,
    },
    "kimara": {
        "name": "Kimara",
        "address": "Kimara, Dar es Salaam",
        "latitude": -6.7900,
        "longitude": 39.2000,
    },

    # ─────────────────────────────────────────
    # ARUSHA
    # ─────────────────────────────────────────
    "arusha": {
        "name": "Arusha City",
        "address": "Arusha, Tanzania",
        "latitude": -3.3731,
        "longitude": 36.6827,
    },
    "njiro": {
        "name": "Njiro",
        "address": "Njiro, Arusha",
        "latitude": -3.3900,
        "longitude": 36.7000,
    },
    "themi": {
        "name": "Themi",
        "address": "Themi, Arusha",
        "latitude": -3.3800,
        "longitude": 36.6900,
    },
    "kijenge": {
        "name": "Kijenge",
        "address": "Kijenge, Arusha",
        "latitude": -3.3700,
        "longitude": 36.6800,
    },
    "sekei": {
        "name": "Sekei",
        "address": "Sekei, Arusha",
        "latitude": -3.3600,
        "longitude": 36.6900,
    },

    # ─────────────────────────────────────────
    # MWANZA
    # ─────────────────────────────────────────
    "mwanza": {
        "name": "Mwanza City",
        "address": "Mwanza, Tanzania",
        "latitude": -2.5164,
        "longitude": 32.9175,
    },
    "nyamagana": {
        "name": "Nyamagana",
        "address": "Nyamagana, Mwanza",
        "latitude": -2.5200,
        "longitude": 32.9000,
    },
    "ilemela": {
        "name": "Ilemela",
        "address": "Ilemela, Mwanza",
        "latitude": -2.5000,
        "longitude": 32.9500,
    },

    # ─────────────────────────────────────────
    # DODOMA
    # ─────────────────────────────────────────
    "dodoma": {
        "name": "Dodoma City",
        "address": "Dodoma, Tanzania",
        "latitude": -6.1630,
        "longitude": 35.7516,
    },
    "nzuguni": {
        "name": "Nzuguni",
        "address": "Nzuguni, Dodoma",
        "latitude": -6.1800,
        "longitude": 35.7500,
    },
    "chamwino": {
        "name": "Chamwino",
        "address": "Chamwino, Dodoma",
        "latitude": -6.2000,
        "longitude": 35.8000,
    },

    # ─────────────────────────────────────────
    # MBEYA
    # ─────────────────────────────────────────
    "mbeya": {
        "name": "Mbeya City",
        "address": "Mbeya, Tanzania",
        "latitude": -8.9000,
        "longitude": 33.4500,
    },
    "iyunga": {
        "name": "Iyunga",
        "address": "Iyunga, Mbeya",
        "latitude": -8.9100,
        "longitude": 33.4400,
    },
    "uyole": {
        "name": "Uyole",
        "address": "Uyole, Mbeya",
        "latitude": -8.9300,
        "longitude": 33.4200,
    },
}


def _stable_id(source: str, name: str, lat: float, lng: float) -> str:
    """Deterministic id from the place — same input always yields same id."""
    raw = f"{source}:{name}:{lat:.6f}:{lng:.6f}".encode()
    return hashlib.sha1(raw).hexdigest()[:16]


def geocode(query: str):
    if MAPBOX_TOKEN:
        try:
            encoded = urllib.parse.quote(query or "")
            url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{encoded}.json"
            r = requests.get(url, params={"access_token": MAPBOX_TOKEN, "limit": 5}, timeout=8)
            r.raise_for_status()
            features = r.json().get("features", [])
            results = []
            for f in features:
                center_lng, center_lat = f["center"]
                name = f.get("text") or f["place_name"].split(",")[0]
                address = f["place_name"]
                results.append({
                    "id": _stable_id("mapbox", name, center_lat, center_lng),
                    "name": name,
                    "address": address,
                    "latitude": center_lat,
                    "longitude": center_lng,
                })
            return results
        except Exception:
            pass

    # Fallback stub — Tanzanian places
    q = (query or "").lower().strip()
    if not q:
        return []

    results = []
    for key, place in DEMO_RESULTS.items():
        if key in q or q in key or q in place["name"].lower() or q in place["address"].lower():
            results.append({
                "id": _stable_id("demo", place["name"], place["latitude"], place["longitude"]),
                "name": place["name"],
                "address": place["address"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
            })
            if len(results) >= 5:
                break
    return results
