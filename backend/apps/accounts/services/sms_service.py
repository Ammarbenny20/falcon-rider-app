"""
SMS dispatch.

Dev: logs the message to console.
Prod: replace send_sms with a real provider (Africa's Talking, Twilio, Beem).
"""
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def send_sms(phone_number: str, message: str) -> bool:
    if settings.DEBUG:
        logger.warning("[DEV SMS] to=%s body=%s", phone_number, message)
        print(f"\n📱 [DEV SMS] {phone_number}: {message}\n")
        return True
    # TODO: integrate real provider
    logger.info("SMS queued to %s", phone_number)
    return True
