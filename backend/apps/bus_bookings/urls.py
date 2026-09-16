from rest_framework.routers import DefaultRouter
from apps.bus_bookings.views import BusBookingViewSet

router = DefaultRouter()
router.register(r"bus-bookings", BusBookingViewSet, basename="bus-booking")
urlpatterns = router.urls