from django.urls import path

from .provider_views import (
    ProviderProfileDetailView,
    ProviderSubmitVerificationView,
    AdminProviderApprovalView,
    ProviderDocumentListCreateView,
    ProviderDocumentDeleteView,
    AdminProviderDocumentListView,
    AdminProviderDocumentReviewView,
    ProviderAvailabilityUpdateView,
    ProviderCapabilitiesUpdateView,
)
from .provider_register import ProviderRegisterView


urlpatterns = [
    # Provider self-service
    path("provider/register/", ProviderRegisterView.as_view(), name="provider-register"),
    path("provider/profile/", ProviderProfileDetailView.as_view(), name="provider-profile"),
    path("provider/verification/submit/", ProviderSubmitVerificationView.as_view(), name="provider-verify-submit"),
    path("provider/availability/", ProviderAvailabilityUpdateView.as_view(), name="provider-availability"),
    path("provider/capabilities/", ProviderCapabilitiesUpdateView.as_view(), name="provider-capabilities"),

    # Documents (provider-side)
    path("provider/documents/", ProviderDocumentListCreateView.as_view(), name="provider-documents"),
    path("provider/documents/<uuid:pk>/", ProviderDocumentDeleteView.as_view(), name="provider-document-detail"),

    # Admin
    path("admin/providers/<uuid:provider_id>/action/", AdminProviderApprovalView.as_view(), name="admin-provider-action"),
    path("admin/provider-documents/", AdminProviderDocumentListView.as_view(), name="admin-provider-documents"),
    path("admin/provider-documents/<uuid:pk>/review/", AdminProviderDocumentReviewView.as_view(), name="admin-provider-document-review"),
]