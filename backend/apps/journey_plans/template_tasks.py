from datetime import datetime, time, timedelta

from celery import shared_task
from django.utils import timezone

from .models import JourneyPlan
from .template_models import JourneyTemplate


def _combine_date_with_time(d, t):
    """Combine a date and a time into a timezone-aware datetime."""
    naive = datetime.combine(d, t)
    return timezone.make_aware(naive)


@shared_task
def generate_journey_instances(days_ahead=7):
    """
    For each active JourneyTemplate, create JourneyPlan instances for
    the next N days where the weekday matches the template's days_of_week.

    Weekday mapping: 1=Monday .. 7=Sunday (matches Python's isoweekday()).
    """
    today = timezone.now().date()
    created_count = 0

    for template in JourneyTemplate.objects.filter(is_active=True).select_related("vehicle", "provider"):
        for offset in range(1, days_ahead + 1):
            target_date = today + timedelta(days=offset)
            if target_date.isoweekday() not in template.days_of_week:
                continue

            departure_at = _combine_date_with_time(target_date, template.departure_time)

            # Skip if a plan already exists for this template + departure
            exists = JourneyPlan.objects.filter(
                provider=template.provider,
                vehicle=template.vehicle,
                scheduled_departure_time=departure_at,
                origin_label=template.origin_label,
                destination_label=template.destination_label,
            ).exists()
            if exists:
                continue

            JourneyPlan.objects.create(
                provider=template.provider,
                vehicle=template.vehicle,
                origin="template.origin.x,template.origin.y, srid=4326",
                origin_label=template.origin_label,
                destination="template.destination.x,template.destination.y, srid=4326",
                destination_label=template.destination_label,
                scheduled_departure_time=departure_at,
                total_seats=template.total_seats,
                available_seats=template.total_seats,
                price_per_seat=template.price_per_seat,
                status="PUBLISHED",
            )
            created_count += 1

    return {"plans_created": created_count}

