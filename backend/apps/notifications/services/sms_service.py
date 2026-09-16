from django.conf import settings


def send_sms(phone_number: str, message: str) -> None:
    if not settings.SMS_API_KEY:
        # Dev fallback — never fail auth flows just because SMS isn't configured yet.
        print(f"[SMS DEV] to={phone_number} msg={message}")
        return
    # Real gateway integration goes here (e.g. Africa's Talking, Twilio).
    import requests
    requests.post(
        "https://api.smsgateway.example/send",
        json={"to": phone_number, "message": message},
        headers={"Authorization": f"Bearer {settings.SMS_API_KEY}"},
        timeout=5,
    )