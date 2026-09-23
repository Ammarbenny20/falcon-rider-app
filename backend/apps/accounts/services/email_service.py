"""
Email dispatch.

Dev: prints to console.
Prod: configure EMAIL_BACKEND in settings for SMTP / SendGrid / etc.
"""
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str) -> bool:
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to], fail_silently=False)
        return True
    except Exception as exc:
        logger.warning("Email send failed: %s", exc)
        return False
