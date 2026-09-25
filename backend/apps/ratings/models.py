import uuid
from django.db import models


class Rating(models.Model):
    """
    Tick-based rating for a completed booking.
    Each category is True (Good) / False (Bad) / None (skipped) — no stars.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    booking = models.OneToOneField(
        "bookings.Booking", on_delete=models.CASCADE, related_name="rating",
    )
    rater = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="ratings_given",
    )
    ratee = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="ratings_received",
    )

    punctuality = models.BooleanField(null=True, blank=True)
    comfort = models.BooleanField(null=True, blank=True)
    cleanliness = models.BooleanField(null=True, blank=True)
    driving_safety = models.BooleanField(null=True, blank=True)

    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ratings_rating"
        indexes = [models.Index(fields=["ratee"], name="ratings_rating_ratee_idx")]

    def __str__(self):
        return f"Rating<{self.booking_id}>"