from django.urls import path

from .notification_views import (
    RegisterDeviceView, NotificationListView,
    NotificationDetailView, NotificationMarkReadView,
)


urlpatterns = [
    path("notifications/register-device/", RegisterDeviceView.as_view(), name="register-device"),
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("notifications/<uuid:pk>/", NotificationDetailView.as_view(), name="notification-detail"),
    path("notifications/<uuid:pk>/read/", NotificationMarkReadView.as_view(), name="notification-read"),
]
