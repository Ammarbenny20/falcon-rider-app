from django.urls import path

from .views import (
    MyReceiptsView, MyReceiptDetailView,
    AdminReceiptListView, AdminReceiptDetailView,
    AdminReconciliationListView, AdminReconciliationExceptionsView,
    AdminReconciliationDetailView,
)


urlpatterns = [
    # Passenger
    path("receipts/mine/", MyReceiptsView.as_view(), name="my-receipts"),
    path("receipts/mine/<uuid:pk>/", MyReceiptDetailView.as_view(), name="my-receipt-detail"),

    # Admin — receipts
    path("admin/receipts/", AdminReceiptListView.as_view(), name="admin-receipt-list"),
    path("admin/receipts/<uuid:pk>/", AdminReceiptDetailView.as_view(), name="admin-receipt-detail"),

    # Admin — reconciliation
    path("admin/reconciliation/", AdminReconciliationListView.as_view(), name="admin-reconciliation-list"),
    path("admin/reconciliation/exceptions/", AdminReconciliationExceptionsView.as_view(), name="admin-reconciliation-exceptions"),
    path("admin/reconciliation/<uuid:trip_id>/", AdminReconciliationDetailView.as_view(), name="admin-reconciliation-detail"),
]
