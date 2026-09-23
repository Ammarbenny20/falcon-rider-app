from celery import shared_task
from django.utils import timezone

from apps.matching.models import MatchProposal
from apps.rider_requests.models import RiderRequest


@shared_task
def expire_stale_proposals():
    now = timezone.now()
    qs = MatchProposal.objects.filter(status="PROPOSED", expires_at__lt=now)
    count = qs.update(status="EXPIRED")
    return {"expired_proposals": count}


@shared_task
def expire_stale_requests():
    now = timezone.now()
    qs = RiderRequest.objects.filter(
        status__in=["SUBMITTED", "MATCHING", "MATCHED"],
        expires_at__lt=now,
    )
    count = qs.update(status="CANCELLED")
    return {"expired_requests": count}
