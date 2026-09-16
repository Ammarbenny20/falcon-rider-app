from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.administration.views import AdminOverviewView, AdminUserViewSet, LiveOperationsView

router = DefaultRouter()
router.register(r"admin/users", AdminUserViewSet, basename="admin-user")

urlpatterns = [
    path("admin/overview/", AdminOverviewView.as_view(), name="admin-overview"),
    path("admin/live-operations/", LiveOperationsView.as_view(), name="admin-live-operations"),
] + router.urls