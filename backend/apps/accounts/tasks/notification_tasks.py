from celery import shared_task

from apps.accounts.services.sms_service import send_sms
from apps.accounts.services.email_service import send_email


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def dispatch_sms(self, phone_number, message):
    try:
        return send_sms(phone_number, message)
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def dispatch_email(self, to, subject, body):
    try:
        return send_email(to, subject, body)
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def dispatch_push(self, token, title, body, data=None):
    """
    Placeholder for real push dispatch (Expo Push API, FCM, etc.).
    In dev: prints to console.
    """
    print(f"📲 [PUSH] token={token}: {title} — {body}")
    return {"token": token, "status": "logged"}
