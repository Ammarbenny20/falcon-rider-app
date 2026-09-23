import uuid
from django.db import models


class MatchProposalStatus(models.TextChoices):
    PROPOSED = "PROPOSED", "Proposed"
    ACCEPTED = "ACCEPTED", "Accepted"
    REJECTED = "REJECTED", "Rejected"
    EXPIRED = "EXPIRED", "Expired"


class MatchProposal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider_request = models.ForeignKey("rider_requests.RiderRequest", on_delete=models.CASCADE, related_name="match_proposals")
    journey_plan = models.ForeignKey("journey_plans.JourneyPlan", on_delete=models.CASCADE, related_name="match_proposals")
    match_score = models.DecimalField(max_digits=5, decimal_places=4)
    proposed_fare_share = models.DecimalField(max_digits=10, decimal_places=2)
    proposed_pickup_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=MatchProposalStatus.choices, default=MatchProposalStatus.PROPOSED)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "matching_matchproposal"
        indexes = [models.Index(fields=["status", "expires_at"])]

    def __str__(self):
        return f"MatchProposal<{self.id}>"
