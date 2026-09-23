from django.apps import AppConfig


class JourneyPlansConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.journey_plans"

    def ready(self):
        from . import template_models  # noqa: F401
