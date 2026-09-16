from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.support.models import SupportTicket
from apps.support.serializers import SupportTicketSerializer, SupportMessageSerializer
from permissions.roles import IsAdminRole


class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return SupportTicket.objects.all().order_by("-created_at")
        return SupportTicket.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        message = ticket.messages.create(author=request.user, body=request.data["body"])
        if request.user.role != "ADMIN":
            ticket.status = SupportTicket.Status.WAITING_FOR_CUSTOMER if False else SupportTicket.Status.OPEN
        else:
            ticket.status = SupportTicket.Status.IN_PROGRESS
        ticket.save(update_fields=["status"])
        return Response(SupportMessageSerializer(message).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminRole])
    def close(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = SupportTicket.Status.CLOSED
        ticket.save(update_fields=["status"])
        return Response(SupportTicketSerializer(ticket).data)