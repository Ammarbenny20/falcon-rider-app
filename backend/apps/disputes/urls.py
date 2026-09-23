from django.urls import path

from .views import (
    FileDisputeView, MyDisputesView,
    AdminDisputeListView, AdminDisputeDetailView, AdminDisputeActionView,
)


urlpatterns = [
    path("disputes/", FileDisputeView.as_view(), name="dispute-file"),
    path("disputes/mine/", MyDisputesView.as_view(), name="dispute-mine"),

    path("admin/disputes/", AdminDisputeListView.as_view(), name="admin-dispute-list"),
    path("admin/disputes/<uuid:pk>/", AdminDisputeDetailView.as_view(), name="admin-dispute-detail"),
    path("admin/disputes/<uuid:pk>/<str:action>/", AdminDisputeActionView.as_view(), name="admin-dispute-action"),
]
