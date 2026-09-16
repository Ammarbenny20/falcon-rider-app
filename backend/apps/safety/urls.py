from rest_framework.routers import DefaultRouter
from apps.safety.views import SafetyIncidentViewSet, TrustedContactViewSet

router = DefaultRouter()
router.register(r"safety/incidents", SafetyIncidentViewSet, basename="safety-incident")
router.register(r"safety/trusted-contacts", TrustedContactViewSet, basename="trusted-contact")
urlpatterns = router.urls