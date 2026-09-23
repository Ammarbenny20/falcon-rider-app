from apps.accounts.notifications_service import _create_notification
from apps.accounts.models import User, UserRole


def notify_admins_refund_filed(rr):
    admins = User.objects.filter(role=UserRole.ADMIN, is_active=True)
    for admin in admins:
        _create_notification(
            admin,
            type_="refund_request_filed",
            title="Ombi jipya la refund",
            body=f"Refund: {rr.amount} {rr.currency} - {rr.get_reason_display()}",
            data={"refund_request_id": str(rr.id)},
        )


def notify_customer_refund_decision(rr):
    if rr.status == "APPROVED":
        title = "Ombi lako la refund limekubaliwa"
        body = f"Refund ya {rr.amount} {rr.currency} itafanyika hivi karibuni."
    elif rr.status == "REJECTED":
        title = "Ombi lako la refund limekataliwa"
        body = f"Sababu: {rr.review_notes or 'Haijulikani'}"
    elif rr.status == "COMPLETED":
        title = "Refund yako imefanyika"
        body = f"Pesa {rr.amount} {rr.currency} zimerejeshwa."
    else:
        return
    _create_notification(
        rr.requested_by,
        type_="refund_request_decision",
        title=title,
        body=body,
        data={"refund_request_id": str(rr.id), "status": rr.status},
    )
