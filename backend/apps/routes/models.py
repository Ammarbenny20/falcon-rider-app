import uuid
from django.db import models


class Route(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    origin_lat = models.DecimalField(max_digits=10, decimal_places=7)
    origin_lng = models.DecimalField(max_digits=10, decimal_places=7)
    destination_lat = models.DecimalField(max_digits=10, decimal_places=7)
    destination_lng = models.DecimalField(max_digits=10, decimal_places=7)
    distance_meters = models.PositiveIntegerField()
    duration_min_seconds = models.PositiveIntegerField()
    duration_max_seconds = models.PositiveIntegerField()
    polyline = models.TextField(blank=True)
    provider_source = models.CharField(max_length=30, default="MAPBOX")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["origin_lat", "origin_lng", "destination_lat", "destination_lng"]),
        ]