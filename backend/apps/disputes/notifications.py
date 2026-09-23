from apps.accounts.notifications_service import _create_notification
from apps.accounts.models import User, UserRole


def notify_dispute_filed(dispute):
    admins = User.objects.filter(role=UserRole.ADMIN, is_active=True)
    for admin in admins:
        _create_notification(
            admin,
            type_="dispute_filed",
            title="Malalamiko mapya",
            body=f"Dispute mpya: {dispute.subject}",
            data={"dispute_id": str(dispute.id), "category": dispute.category},
        )


def notify_dispute_status_changed(dispute):
    _create_notification(
        dispute.reporter,
        type_="dispute_status_changed",
        title="Malalamiko yako yanachunguzwa",
        body=f"Tunaangalia malalamiko yako: {dispute.subject}",
        data={"dispute_id": str(dispute.id), "status": dispute.status},
    )


def notify_dispute_resolved(dispute):
    _create_notification(
        dispute.reporter,
        type_="dispute_resolved",
        title="Malalamiko yako yametatuliwa",
        body=f"Malalamiko yako yametatuliwa. Uamuzi: {dispute.resolution}",
        data={"dispute_id": str(dispute.id), "resolution": dispute.resolution or ""},
    )
