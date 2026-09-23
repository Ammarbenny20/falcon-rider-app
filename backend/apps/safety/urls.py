from django.urls import path

from .views import (
    EmergencyContactListCreateView,
    SosAlertCreateView,
    TripShareCreateView,
)

urlpatterns = [
    path("safety/emergency-contacts/", EmergencyContactListCreateView.as_view(), name="emergency-contacts"),
    path("safety/sos/", SosAlertCreateView.as_view(), name="sos-alert"),
    path("safety/trip-share/", TripShareCreateView.as_view(), name="trip-share"),
]
