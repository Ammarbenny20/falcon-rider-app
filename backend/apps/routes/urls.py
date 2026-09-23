from django.urls import path

from .views import GeocodeView, DirectionsView

urlpatterns = [
    path("routes/geocode/", GeocodeView.as_view(), name="routes-geocode"),
    path("routes/directions/", DirectionsView.as_view(), name="routes-directions"),
]
