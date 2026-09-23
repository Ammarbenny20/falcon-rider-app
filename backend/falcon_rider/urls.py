from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),

    # Auth
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.accounts.notification_urls")),
    path("api/v1/", include("apps.accounts.admin_urls")),
    path("api/v1/", include("apps.vehicles.urls")),
    path("api/v1/", include("apps.accounts.provider_urls")),
    
    # Phase 2
    path("api/v1/", include("apps.rider_requests.urls")),
    path("api/v1/", include("apps.journey_plans.urls")),
    path("api/v1/", include("apps.bookings.urls")),
    path("api/v1/", include("apps.journeys.urls")),
    path("api/v1/", include("apps.payments.urls")),
    path("api/v1/", include("apps.routes.urls")),
    path("api/v1/", include("apps.safety.urls")),
    path("api/v1/", include("apps.disputes.urls")),
    path("api/v1/", include("apps.refund_requests.urls")),
    path("api/v1/", include("apps.payouts.urls")),
    path("api/v1/", include("apps.receipts.urls")),
    path("api/v1/", include("apps.governance.urls")),
    path("api/v1/", include("apps.admin_ops.urls")),
]
