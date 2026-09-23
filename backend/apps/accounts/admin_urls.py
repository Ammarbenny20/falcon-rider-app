from django.urls import path

from .admin_extended import (
    AdminProviderCapabilityActionView,
    AdminPendingProvidersView, AdminProviderActionView,
    AdminUserListView, AdminUserDetailView, AdminUserActionView,
)
from .admin_analytics import (
    AdminAnalyticsView, AdminRevenueAnalyticsView, AdminTripsAnalyticsView,
    AdminRefundPaymentView,
)
from .admin_dashboard import (
    DashboardOverviewView, LiveStatsView, ActionCenterView,
    ActivityFeedView, LiveMapView,
)
from .admin_endpoints import (
    AdminProviderListView, AdminProviderDetailView,
    AdminRideListView, AdminTripListView,
    AdminPaymentListView, AdminSafetyListView,
    AdminAuditLogListView,
)


urlpatterns = [
    path("admin/providers/", AdminProviderListView.as_view(), name="admin-provider-list"),
    path("admin/providers/<uuid:pk>/", AdminProviderDetailView.as_view(), name="admin-provider-detail"),
    path("admin/rides/", AdminRideListView.as_view(), name="admin-ride-list"),
    path("admin/trips/", AdminTripListView.as_view(), name="admin-trip-list"),
    path("admin/payments/", AdminPaymentListView.as_view(), name="admin-payment-list"),
    path("admin/safety/", AdminSafetyListView.as_view(), name="admin-safety-list"),
    path("admin/audit-logs/", AdminAuditLogListView.as_view(), name="admin-audit-log-list"),

    # Command Center
    path("admin/dashboard/overview/", DashboardOverviewView.as_view(), name="admin-dashboard-overview"),
    path("admin/dashboard/live-stats/", LiveStatsView.as_view(), name="admin-dashboard-live-stats"),
    path("admin/dashboard/action-center/", ActionCenterView.as_view(), name="admin-dashboard-action-center"),
    path("admin/dashboard/activity/", ActivityFeedView.as_view(), name="admin-dashboard-activity"),
    path("admin/dashboard/map/", LiveMapView.as_view(), name="admin-dashboard-map"),

    # Extended
    path("admin/providers/pending/", AdminPendingProvidersView.as_view(), name="admin-providers-pending"),
    path("admin/providers/<uuid:provider_id>/<str:action>/", AdminProviderActionView.as_view(), name="admin-provider-action-ext"),
    path("admin/providers/<uuid:provider_id>/<str:capability>/<str:action>/", AdminProviderCapabilityActionView.as_view(), name="admin-provider-capability-action"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<uuid:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/users/<uuid:pk>/<str:action>/", AdminUserActionView.as_view(), name="admin-user-action"),

    # Analytics
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("admin/analytics/revenue/", AdminRevenueAnalyticsView.as_view(), name="admin-analytics-revenue"),
    path("admin/analytics/trips/", AdminTripsAnalyticsView.as_view(), name="admin-analytics-trips"),

    # Disputes (stub)

    # Refunds
    path("admin/payments/<uuid:pk>/refund/", AdminRefundPaymentView.as_view(), name="admin-payment-refund"),
]
