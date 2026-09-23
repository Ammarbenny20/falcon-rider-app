from django.urls import path

from .views import (
    RiderRequestListCreateView,
    RiderRequestDetailView,
    RiderRequestCancelView,
    RiderRequestProposalsView,
)
from .ride_options_views import RideOptionsView, RideOptionAvailabilityView
from .live_views import RiderRequestLiveView


urlpatterns = [
    # Ride options (new)
    path("ride-options/", RideOptionsView.as_view(), name="ride-options"),
    path("ride-options/<str:mode>/availability/", RideOptionAvailabilityView.as_view(), name="ride-option-availability"),

    # Rider requests
    path("rider-requests/", RiderRequestListCreateView.as_view(), name="rider-request-list"),
    path("rider-requests/<uuid:pk>/", RiderRequestDetailView.as_view(), name="rider-request-detail"),
    path("rider-requests/<uuid:pk>/cancel/", RiderRequestCancelView.as_view(), name="rider-request-cancel"),
    path("rider-requests/<uuid:pk>/proposals/", RiderRequestProposalsView.as_view(), name="rider-request-proposals"),
    path("rider-requests/<uuid:pk>/live/", RiderRequestLiveView.as_view(), name="rider-request-live"),
]
