from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from apps.providers.models import ProviderVerification, VerificationStatus

TRANSITIONS = {
    VerificationStatus.NOT_STARTED: {
        VerificationStatus.IN_PROGRESS,
    },
    VerificationStatus.IN_PROGRESS: {
        VerificationStatus.SUBMITTED,
    },
    VerificationStatus.SUBMITTED: {
        VerificationStatus.UNDER_REVIEW,
    },
    VerificationStatus.UNDER_REVIEW: {
        VerificationStatus.APPROVED,
        VerificationStatus.REJECTED,
        VerificationStatus.CORRECTION_REQUIRED,
    },
    VerificationStatus.CORRECTION_REQUIRED: {
        VerificationStatus.RESUBMITTED,
    },
    VerificationStatus.RESUBMITTED: {
        VerificationStatus.UNDER_REVIEW,
    },
}

def _assert_transition(verification, new_status):
    allowed = TRANSITIONS.get(verification.status, set())
    if new_status not in allowed:
        raise ValidationError(f"Cannot move verification from {verification.status} to {new_status}.")


@transaction.atomic
def submit_verification(provider, documents: dict) -> ProviderVerification:
    verification, _ = ProviderVerification.objects.get_or_create(provider=provider)
    verification = ProviderVerification.objects.select_for_update().get(id=verification.id)

    target = (
        VerificationStatus.SUBMITTED
        if verification.status in (VerificationStatus.NOT_STARTED, VerificationStatus.IN_PROGRESS)
        else VerificationStatus.RESUBMITTED
    )
    if verification.status == VerificationStatus.NOT_STARTED:
        verification.status = VerificationStatus.IN_PROGRESS
        verification.save(update_fields=["status"])

    _assert_transition(verification, target)
    verification.status = target
    verification.documents = documents
    verification.submitted_at = timezone.now()
    verification.save(update_fields=["status", "documents", "submitted_at"])
    return verification


@transaction.atomic
def start_review(verification_id, admin_user) -> ProviderVerification:
    verification = ProviderVerification.objects.select_for_update().get(id=verification_id)
    _assert_transition(verification, VerificationStatus.UNDER_REVIEW)
    verification.status = VerificationStatus.UNDER_REVIEW
    verification.reviewer = admin_user
    verification.save(update_fields=["status", "reviewer"])
    return verification


@transaction.atomic
def approve(verification_id, admin_user) -> ProviderVerification:
    verification = ProviderVerification.objects.select_for_update().get(id=verification_id)
    _assert_transition(verification, VerificationStatus.APPROVED)
    verification.status = VerificationStatus.APPROVED
    verification.reviewer = admin_user
    verification.reviewed_at = timezone.now()
    verification.save(update_fields=["status", "reviewer", "reviewed_at"])
    _log_audit(admin_user, "PROVIDER_APPROVED", verification.provider)
    return verification


@transaction.atomic
def reject(verification_id, admin_user, notes: str = "") -> ProviderVerification:
    verification = ProviderVerification.objects.select_for_update().get(id=verification_id)
    _assert_transition(verification, VerificationStatus.REJECTED)
    verification.status = VerificationStatus.REJECTED
    verification.reviewer = admin_user
    verification.correction_notes = notes
    verification.reviewed_at = timezone.now()
    verification.save(update_fields=["status", "reviewer", "correction_notes", "reviewed_at"])
    _log_audit(admin_user, "PROVIDER_REJECTED", verification.provider)
    return verification


@transaction.atomic
def request_correction(verification_id, admin_user, notes: str) -> ProviderVerification:
    verification = ProviderVerification.objects.select_for_update().get(id=verification_id)
    _assert_transition(verification, VerificationStatus.CORRECTION_REQUIRED)
    verification.status = VerificationStatus.CORRECTION_REQUIRED
    verification.reviewer = admin_user
    verification.correction_notes = notes
    verification.save(update_fields=["status", "reviewer", "correction_notes"])
    return verification


def _log_audit(actor, action, provider):
    from apps.administration.models import AuditLog
    AuditLog.objects.create(
        actor=actor, action=action, entity="Provider", entity_id=str(provider.id),
        metadata={"provider_id": str(provider.id)},
    )