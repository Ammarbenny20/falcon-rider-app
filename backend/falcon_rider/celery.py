import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "falcon_rider.settings.development")

app = Celery("falcon_rider")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()