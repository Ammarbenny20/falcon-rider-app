from rest_framework.routers import DefaultRouter
from apps.payments.views import PaymentViewSet, AdminPaymentsSummaryView

router = DefaultRouter()
router.register(r"payments", PaymentViewSet, basename="payment")
router.register(r"admin/payments-summary", AdminPaymentsSummaryView, basename="admin-payments-summary")
urlpatterns = router.urls