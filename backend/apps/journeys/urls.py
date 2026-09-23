from django.urls import path

from .views import (
    JourneyDetailView, JourneyStartView, JourneyCompleteView,
    JourneyAbortView, JourneyLocationView,
)

urlpatterns = [
    path("journeys/<uuid:pk>/", JourneyDetailView.as_view(), name="journey-detail"),
    path("journeys/<uuid:pk>/start/", JourneyStartView.as_view(), name="journey-start"),
    path("journeys/<uuid:pk>/complete/", JourneyCompleteView.as_view(), name="journey-complete"),
    path("journeys/<uuid:pk>/abort/", JourneyAbortView.as_view(), name="journey-abort"),
    path("journeys/<uuid:pk>/location/", JourneyLocationView.as_view(), name="journey-location"),
]
