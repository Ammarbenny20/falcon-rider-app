from django.urls import path

from .views import (
    MyEarningsView, MyPayoutsView,
    AdminEarningsListView,
    AdminPayoutListView, AdminPayoutDetailView, AdminPayoutActionView,
    AdminGeneratePayoutsView,
)


urlpatterns = [
    # Provider
    path("earnings/", MyEarningsView.as_view(), name="my-earnings"),
    path("payouts/mine/", MyPayoutsView.as_view(), name="my-payouts"),

    # Admin
    path("admin/earnings/", AdminEarningsListView.as_view(), name="admin-earnings-list"),
    path("admin/payouts/", AdminPayoutListView.as_view(), name="admin-payout-list"),
    path("admin/payouts/generate/", AdminGeneratePayoutsView.as_view(), name="admin-payout-generate"),
    path("admin/payouts/<uuid:pk>/", AdminPayoutDetailView.as_view(), name="admin-payout-detail"),
    path("admin/payouts/<uuid:pk>/<str:action>/", AdminPayoutActionView.as_view(), name="admin-payout-action"),
]
