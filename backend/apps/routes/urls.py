from django.urls import path
from apps.routes.views import GeocodeView, RouteCalculateView

urlpatterns = [
    path("routes/geocode/", GeocodeView.as_view(), name="geocode"),
    path("routes/calculate/", RouteCalculateView.as_view(), name="route-calculate"),
]