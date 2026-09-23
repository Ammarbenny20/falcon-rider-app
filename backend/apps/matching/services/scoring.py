"""
Scoring functions for the matching engine.

Each function returns a value between 0.0 and 1.0 where 1.0 is a perfect match.
"""

from math import radians, cos, sin, asin, sqrt


# Maximum distance (in meters) at which a candidate is considered a plausible match.
MAX_ORIGIN_DISTANCE_M = 3000     # 3 km — passenger can walk / boda to pickup
MAX_DESTINATION_DISTANCE_M = 3000
MAX_TIME_OFFSET_SECONDS = 7200   # ±2 hours


def haversine_distance_m(lat1, lng1, lat2, lng2):
    """Great-circle distance in meters between two lat/lng points."""
    R = 6371000.0  # Earth radius in meters
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return 2 * R * asin(sqrt(a))


def score_distance(lat1, lng1, lat2, lng2, max_m):
    """
    Score based on proximity. Closer = higher score.
    Returns 0.0 if beyond max_m.
    """
    d = haversine_distance_m(lat1, lng1, lat2, lng2)
    if d > max_m:
        return 0.0
    return 1.0 - (d / max_m)


def score_time(requested_ts, departure_ts):
    """
    Score based on time alignment. Smaller gap = higher score.
    Returns 0.0 if beyond MAX_TIME_OFFSET_SECONDS.
    """
    diff = abs((departure_ts - requested_ts).total_seconds())
    if diff > MAX_TIME_OFFSET_SECONDS:
        return 0.0
    return 1.0 - (diff / MAX_TIME_OFFSET_SECONDS)


def compute_match_score(rider_request, journey_plan):
    """
    Compute a 0.0–1.0 match score between a RiderRequest and a JourneyPlan.
    Returns None if the candidate should be rejected outright (hard filter).

    Weights:
        origin proximity       40%
        destination proximity  40%
        time alignment         20%
    """
    if journey_plan.available_seats < rider_request.seats_needed:
        return None
    if journey_plan.status != "PUBLISHED":
        return None

    origin_score = score_distance(
        rider_request.origin.y, rider_request.origin.x,
        journey_plan.origin.y, journey_plan.origin.x,
        MAX_ORIGIN_DISTANCE_M,
    )
    if origin_score == 0.0:
        return None

    destination_score = score_distance(
        rider_request.destination.y, rider_request.destination.x,
        journey_plan.destination.y, journey_plan.destination.x,
        MAX_DESTINATION_DISTANCE_M,
    )
    if destination_score == 0.0:
        return None

    time_score = score_time(
        rider_request.requested_time,
        journey_plan.scheduled_departure_time,
    )
    if time_score == 0.0:
        return None

    total = (
        0.40 * origin_score
        + 0.40 * destination_score
        + 0.20 * time_score
    )
    return round(total, 4)


def compute_fare_share(rider_request, journey_plan):
    """
    Proposed fare for the passenger. Currently a simple formula:
        price_per_seat × seats_needed
    Later can factor in distance, traffic, demand, discounts.
    """
    return journey_plan.price_per_seat * rider_request.seats_needed
