from celery import shared_task

from apps.matching.services.matching_engine import (
    find_matches_for_request as _find_matches,
)


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def find_matches_for_request(self, rider_request_id):
    """
    Celery task wrapper around the matching engine.
    Retries up to 3 times on unexpected failure.
    """
    try:
        count = _find_matches(rider_request_id)
        return {"rider_request_id": str(rider_request_id), "proposals_created": count}
    except Exception as exc:
        raise self.retry(exc=exc)
