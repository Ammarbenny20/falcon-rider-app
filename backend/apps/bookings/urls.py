from django.urls import path

from .views import (
    BookingListCreateView, BookingDetailView,
    BookingCancelView, BookingCostView,
)

urlpatterns = [
    path("bookings/", BookingListCreateView.as_view(), name="booking-list"),
    path("bookings/<uuid:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("bookings/<uuid:pk>/cancel/", BookingCancelView.as_view(), name="booking-cancel"),
    path("bookings/<uuid:pk>/cost/", BookingCostView.as_view(), name="booking-cost"),
]
