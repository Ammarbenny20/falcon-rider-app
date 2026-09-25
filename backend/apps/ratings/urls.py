from django.urls import path

from .views import RateBookingView, MyRatingsGivenView, ProviderRatingSummaryView

urlpatterns = [
    path("ratings/", RateBookingView.as_view(), name="rating-create"),
    path("ratings/mine/", MyRatingsGivenView.as_view(), name="rating-mine"),
    path("providers/<uuid:provider_user_id>/ratings/summary/", ProviderRatingSummaryView.as_view(), name="provider-rating-summary"),
]