from django.urls import path

from .views import (
    AdminStaffListView, AdminRolesListView, AdminPermissionsListView,
    AdminNotificationsListView, AdminNotificationRetryView,
    AdminSettingsView,
    AdminGlobalSearchView,
)


urlpatterns = [
    # 6a — Staff / Roles / Permissions
    path("admin/staff/", AdminStaffListView.as_view(), name="admin-staff-list"),
    path("admin/roles/", AdminRolesListView.as_view(), name="admin-roles-list"),
    path("admin/permissions/", AdminPermissionsListView.as_view(), name="admin-permissions-list"),

    # 6b — Notifications admin
    path("admin/notifications/", AdminNotificationsListView.as_view(), name="admin-notifications-list"),
    path("admin/notifications/<uuid:pk>/retry/", AdminNotificationRetryView.as_view(), name="admin-notification-retry"),

    # 6c — Settings
    path("admin/settings/", AdminSettingsView.as_view(), name="admin-settings"),

    # 6d — Global search
    path("admin/search/", AdminGlobalSearchView.as_view(), name="admin-global-search"),
]
