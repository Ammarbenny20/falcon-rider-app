from django.urls import path

from .views import (
    PaymentInitiateView, PaymentWebhookView,
    PaymentConfirmDemoView, PaymentDetailView,
)


urlpatterns = [
    path("payments/initiate/", PaymentInitiateView.as_view(), name="payment-initiate"),
    path("payments/webhook/", PaymentWebhookView.as_view(), name="payment-webhook"),
    path("payments/<uuid:pk>/confirm/", PaymentConfirmDemoView.as_view(), name="payment-confirm-demo"),
    path("payments/<uuid:pk>/", PaymentDetailView.as_view(), name="payment-detail"),
]