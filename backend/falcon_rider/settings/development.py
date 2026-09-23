"""
Falcon Rider — Development Settings

Uses SQLite + Memory Cache for dev.
No GDAL, no PostGIS, no Redis needed.
Switch to PostgreSQL + PostGIS + Redis for production.
"""

from .base import *
import os

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

# ─────────────────────────────────────────
# DATABASE — SQLite (no PostGIS/GDAL)
# ─────────────────────────────────────────

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ─────────────────────────────────────────
# CACHE — Memory (no Redis)
# ─────────────────────────────────────────

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-falcon-rider-dev",
    }
}

# ─────────────────────────────────────────
# SESSION — Database (no Redis)
# ─────────────────────────────────────────

SESSION_ENGINE = "django.contrib.sessions.backends.db"

# ─────────────────────────────────────────
# CELERY — Eager (no Redis broker)
# ─────────────────────────────────────────

CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"
