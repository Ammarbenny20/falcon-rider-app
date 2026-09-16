from dataclasses import dataclass
from datetime import timedelta
from django.utils import timezone
from apps.journeys.models import TransportType
from apps.routes.services.map_services import get_map_provider
from apps.providers.models import Provider, ProviderAvailability

# Base fare structure — backend-configurable, never hard-coded in the client
# (spec section 14/46). In production this would read from a pricing table
# per transport type; kept as constants here for clarity.
BASE_FARE = {
    TransportType.BODA_BODA: {"base": 1500, "per_km": 350},
    TransportType.BAJAJI: {"base": 2000, "per_km": 400},
    TransportType.CAR: {"base": 3000, "per_km": 600},
    TransportType.BUS: {"base": 1000, "per_km": 150},
}

PICKUP_ETA_SECONDS = {
    TransportType.BODA_BODA: 240,
    TransportType.BAJAJI: 420,
    TransportType.CAR: 480,
    TransportType.BUS: 900,
}


@dataclass
class TransportQuote:
    transport_type: str
    pickup_eta_seconds: int
    travel_time_min_seconds: int
    travel_time_max_seconds: int
    estimated_arrival_at: str
    fare_amount: float
    availability: str
    seats_remaining: int | None = None
    seats_total: int | None = None


def _fare_for(transport_type: str, distance_meters: int) -> float:
    rates = BASE_FARE[transport_type]
    km = distance_meters / 1000
    return round(rates["base"] + km * rates["per_km"], -2)  # round to nearest 100 TZS


def _availability_for(transport_type: str) -> tuple[str, int | None, int | None]:
    """
    Private transport (boda/bajaji/car): AVAILABLE/BUSY/UNAVAILABLE based on
    whether any eligible online provider of that type exists nearby.
    Shared transport (bus): seat-based availability from ProviderAvailability.
    Spec section 15 — never fabricate seat counts for private vehicles.
    """
    online_providers = Provider.objects.filter(
        is_online=True, status="ACTIVE",
        vehicles__vehicle_type=transport_type, vehicles__status="ACTIVE",
    ).distinct()

    if transport_type == TransportType.BUS:
        agg = ProviderAvailability.objects.filter(
            provider__in=online_providers
        ).order_by("-seats_total").first()
        if not agg or not agg.seats_total:
            return "UNAVAILABLE", None, None
        remaining = agg.seats_total - (agg.seats_booked or 0)
        ratio = remaining / agg.seats_total
        if remaining <= 0:
            level = "FULL"
        elif ratio < 0.15:
            level = "NEARLY_FULL"
        elif ratio < 0.5:
            level = "LIMITED"
        else:
            level = "AVAILABLE"
        return level, remaining, agg.seats_total

    count = online_providers.count()
    if count == 0:
        return "UNAVAILABLE", None, None
    return "AVAILABLE", None, None


def get_quotes(origin: tuple, destination: tuple) -> list[TransportQuote]:
    route = get_map_provider().calculate_route(origin, destination)
    now = timezone.now()
    quotes = []

    for transport_type in TransportType.values:
        availability, seats_remaining, seats_total = _availability_for(transport_type)
        if availability == "UNAVAILABLE":
            continue  # don't show options with nothing to offer

        pickup_eta = PICKUP_ETA_SECONDS[transport_type]
        arrival = now + timedelta(seconds=pickup_eta + route.duration_max_seconds)

        quotes.append(TransportQuote(
            transport_type=transport_type,
            pickup_eta_seconds=pickup_eta,
            travel_time_min_seconds=route.duration_min_seconds,
            travel_time_max_seconds=route.duration_max_seconds,
            estimated_arrival_at=arrival.isoformat(),
            fare_amount=_fare_for(transport_type, route.distance_meters),
            availability=availability,
            seats_remaining=seats_remaining,
            seats_total=seats_total,
        ))
    return quotes