"""
Runtime settings storage — uses Redis via Django cache so it works
multi-worker without a DB table.
"""
import json

from django.core.cache import cache

from .catalog import DEFAULT_SETTINGS

CACHE_KEY = "governance:platform_settings"


def get_settings():
    raw = cache.get(CACHE_KEY)
    if raw:
        try:
            saved = json.loads(raw)
        except Exception:
            saved = {}
    else:
        saved = {}
    # Merge with defaults so new keys are always present
    merged = dict(DEFAULT_SETTINGS)
    merged.update(saved)
    return merged


def update_settings(patch):
    current = get_settings()
    current.update(patch)
    cache.set(CACHE_KEY, json.dumps(current), timeout=None)
    return current
