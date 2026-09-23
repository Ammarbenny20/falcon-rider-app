from django.urls import path

from .views import (
    FileRefundRequestView, MyRefundRequestsView,
    AdminRefundRequestListView, AdminRefundRequestDetailView,
    AdminRefundRequestDecisionView,
)


urlpatterns = [
    path("refund-requests/", FileRefundRequestView.as_view(), name="refund-request-file"),
    path("refund-requests/mine/", MyRefundRequestsView.as_view(), name="refund-request-mine"),

    path("admin/refund-requests/", AdminRefundRequestListView.as_view(), name="admin-refund-request-list"),
    path("admin/refund-requests/<uuid:pk>/", AdminRefundRequestDetailView.as_view(), name="admin-refund-request-detail"),
    path("admin/refund-requests/<uuid:pk>/<str:action>/", AdminRefundRequestDecisionView.as_view(), name="admin-refund-request-decision"),
]
