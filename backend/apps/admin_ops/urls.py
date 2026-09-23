from django.urls import path

from .views import (
    AdminVerificationQueueView, AdminVerificationDetailView,
    AdminVerificationApproveView, AdminVerificationRejectView,
    AdminVehicleListView, AdminVehicleDetailView,
    AdminJourneyListView, AdminJourneyDetailView,
    AdminJourneyTemplateListView, AdminJourneyInstanceListView,
)


urlpatterns = [
    # Verification queue
    path("admin/verification/queue/", AdminVerificationQueueView.as_view(), name="admin-verification-queue"),
    path("admin/verification/<uuid:pk>/", AdminVerificationDetailView.as_view(), name="admin-verification-detail"),
    path("admin/verification/<uuid:pk>/approve/", AdminVerificationApproveView.as_view(), name="admin-verification-approve"),
    path("admin/verification/<uuid:pk>/reject/", AdminVerificationRejectView.as_view(), name="admin-verification-reject"),

    # Vehicles
    path("admin/vehicles/", AdminVehicleListView.as_view(), name="admin-vehicle-list"),
    path("admin/vehicles/<uuid:pk>/", AdminVehicleDetailView.as_view(), name="admin-vehicle-detail"),

    # Community journeys
    path("admin/journeys/", AdminJourneyListView.as_view(), name="admin-journey-list"),
    path("admin/journeys/<uuid:pk>/", AdminJourneyDetailView.as_view(), name="admin-journey-detail"),
    path("admin/journey-templates/", AdminJourneyTemplateListView.as_view(), name="admin-journey-template-list"),
    path("admin/journey-instances/", AdminJourneyInstanceListView.as_view(), name="admin-journey-instance-list"),
]
