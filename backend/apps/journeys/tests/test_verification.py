from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.accounts.models import User
from apps.providers.models import Provider, ProviderType, ProviderStatus, ProviderVerification, VerificationStatus
from apps.providers.services import verification_service


class VerificationLifecycleTests(TestCase):
    def setUp(self):
        self.provider_user = User.objects.create_user(phone_number="+255700000040", role=User.Role.PROVIDER)
        self.admin = User.objects.create_user(phone_number="+255700000041", role=User.Role.ADMIN)
        self.provider = Provider.objects.create(
            user=self.provider_user, provider_type=ProviderType.INDIVIDUAL_PROVIDER, status=ProviderStatus.ACTIVE
        )

    def test_submit_moves_not_started_to_submitted(self):
        v = verification_service.submit_verification(self.provider, {"license": "url"})
        self.assertEqual(v.status, VerificationStatus.SUBMITTED)

    def test_full_approve_path(self):
        verification_service.submit_verification(self.provider, {})
        v = ProviderVerification.objects.get(provider=self.provider)
        verification_service.start_review(v.id, self.admin)
        v = verification_service.approve(v.id, self.admin)
        self.assertEqual(v.status, VerificationStatus.APPROVED)
        self.assertEqual(v.reviewer, self.admin)

    def test_correction_and_resubmit_path(self):
        verification_service.submit_verification(self.provider, {})
        v = ProviderVerification.objects.get(provider=self.provider)
        verification_service.start_review(v.id, self.admin)
        verification_service.request_correction(v.id, self.admin, "Blurry photo")
        v.refresh_from_db()
        self.assertEqual(v.status, VerificationStatus.CORRECTION_REQUIRED)

        v = verification_service.submit_verification(self.provider, {"license": "new_url"})
        self.assertEqual(v.status, VerificationStatus.RESUBMITTED)

    def test_cannot_approve_without_review(self):
        verification_service.submit_verification(self.provider, {})
        v = ProviderVerification.objects.get(provider=self.provider)
        with self.assertRaises(ValidationError):
            verification_service.approve(v.id, self.admin)

    def test_provider_ineligible_until_approved(self):
        self.assertFalse(self.provider.is_eligible_to_go_online)
        self.assertIn("Provider verification is not approved.", self.provider.eligibility_blockers())