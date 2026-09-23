from django.urls import path

from .views import (
    JourneyPlanListCreateView, JourneyPlanDetailView,
    JourneyPlanCancelView, JourneyPlanBookingsView,
)
from .template_views import (
    JourneyTemplateListCreateView, JourneyTemplateDetailView,
)
from .community_views import (
    CommunityJourneyListCreateView, CommunityJourneyDetailView,
    CommunityJourneyCancelView, CommunityJourneyRequestsView,
    CommunityJourneyRequestDecisionView, CommunityJourneyJoinView,
)


urlpatterns = [
    path("journey-plans/", JourneyPlanListCreateView.as_view(), name="journey-plan-list"),
    path("journey-plans/<uuid:pk>/", JourneyPlanDetailView.as_view(), name="journey-plan-detail"),
    path("journey-plans/<uuid:pk>/cancel/", JourneyPlanCancelView.as_view(), name="journey-plan-cancel"),
    path("journey-plans/<uuid:pk>/bookings/", JourneyPlanBookingsView.as_view(), name="journey-plan-bookings"),

    path("journey-templates/", JourneyTemplateListCreateView.as_view(), name="journey-template-list"),
    path("journey-templates/<uuid:pk>/", JourneyTemplateDetailView.as_view(), name="journey-template-detail"),

    path("community-journeys/", CommunityJourneyListCreateView.as_view(), name="community-journey-list"),
    path("community-journeys/<uuid:pk>/", CommunityJourneyDetailView.as_view(), name="community-journey-detail"),
    path("community-journeys/<uuid:pk>/cancel/", CommunityJourneyCancelView.as_view(), name="community-journey-cancel"),
    path("community-journeys/<uuid:pk>/requests/", CommunityJourneyRequestsView.as_view(), name="community-journey-requests"),
    path("community-journeys/<uuid:pk>/requests/<uuid:rid>/accept/", CommunityJourneyRequestDecisionView.as_view(), kwargs={"action": "accept"}, name="community-journey-request-accept"),
    path("community-journeys/<uuid:pk>/requests/<uuid:rid>/reject/", CommunityJourneyRequestDecisionView.as_view(), kwargs={"action": "reject"}, name="community-journey-request-reject"),
    path("community-journeys/<uuid:pk>/join/", CommunityJourneyJoinView.as_view(), name="community-journey-join"),
]
