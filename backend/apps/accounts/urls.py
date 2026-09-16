from django.urls import path
from apps.accounts.views import RequestOTPView, VerifyOTPView, LogoutView, MeView

urlpatterns = [
    path("auth/otp/request/", RequestOTPView.as_view(), name="otp-request"),
    path("auth/otp/verify/", VerifyOTPView.as_view(), name="otp-verify"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),
]