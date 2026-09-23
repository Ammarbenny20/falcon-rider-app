from .base import *
import os
from django.core.exceptions import ImproperlyConfigured


def _require_env(name):
    value = os.environ.get(name)
    if not value:
        raise ImproperlyConfigured(f"{name} must be set in production.")
    return value


DEBUG = False

SECRET_KEY = _require_env("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = [h.strip() for h in _require_env("DJANGO_ALLOWED_HOSTS").split(",") if h.strip()]

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": _require_env("DB_NAME"),
        "USER": _require_env("DB_USER"),
        "PASSWORD": _require_env("DB_PASSWORD"),
        "HOST": _require_env("DB_HOST"),
        "PORT": os.environ.get("DB_PORT", "5432"),
        "CONN_MAX_AGE": 60,
    }
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"