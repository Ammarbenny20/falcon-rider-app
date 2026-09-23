from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification, PushToken


class RegisterDeviceView(APIView):
    def post(self, request):
        token = request.data.get("token")
        platform = request.data.get("platform")
        if not token or platform not in ("ios", "android"):
            return Response(
                {"detail": "token and platform (ios|android) are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        obj, created = PushToken.objects.update_or_create(
            token=token,
            defaults={"user": request.user, "platform": platform},
        )
        return Response(
            {"id": str(obj.id), "platform": obj.platform, "created": created},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class NotificationListView(APIView):
    def get(self, request):
        qs = Notification.objects.filter(user=request.user).order_by("-created_at")[:50]
        return Response([
            {
                "id": str(n.id),
                "title": n.title,
                "body": n.body,
                "data": n.data,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in qs
        ])


class NotificationDetailView(APIView):
    def get(self, request, pk):
        try:
            n = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        return Response({
            "id": str(n.id),
            "title": n.title,
            "body": n.body,
            "data": n.data,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
        })


class NotificationMarkReadView(APIView):
    def post(self, request, pk):
        try:
            n = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        n.is_read = True
        n.save(update_fields=["is_read"])
        return Response({"id": str(n.id), "is_read": True})
