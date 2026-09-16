from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.journeys.views import JourneyViewSet, JourneyQuoteView

router = DefaultRouter()
router.register(r"journeys", JourneyViewSet, basename="journey")

urlpatterns = [
    path("journeys/quote/", JourneyQuoteView.as_view(), name="journey-quote"),
] + router.urls