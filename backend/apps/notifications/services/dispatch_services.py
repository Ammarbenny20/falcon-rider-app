from apps.notifications.models import Notification


def notify(user, title: str, body: str, category: str, related_entity="", related_entity_id=""):
    notification = Notification.objects.create(
        recipient=user, title=title, body=body, category=category,
        related_entity=related_entity, related_entity_id=related_entity_id,
    )
    # Future channels plug in here without touching call sites:
    # push_service.send(user, title, body)
    # sms_service.send_sms(user.phone_number, body)
    return notification