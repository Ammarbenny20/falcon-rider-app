from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.exceptions import ValidationError

from apps.accounts.models import User
from apps.accounts.serializers import RequestOTPSerializer, VerifyOTPSerializer, UserSerializer
from apps.accounts.services import otp_services as otp_service


class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_service.request_otp(serializer.validated_data["phone_number"])
        return Response({"detail": "Code sent."})


class VerifyOTPView(APIView):
    """
    Spec section 7: light-touch entry — a passenger can be created on first
    successful OTP verification without a heavy registration form.
    Role is independently trusted from the backend record after first login,
    never re-derived from client input on subsequent calls.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            otp_service.verify_otp(data["phone_number"], data["code"])
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            phone_number=data["phone_number"],
            defaults={
                "role": data.get("role", User.Role.PASSENGER),
                "full_name": data.get("full_name", ""),
            },
        )
        if user.status == User.Status.SUSPENDED:
            return Response({"detail": "Account suspended."}, status=status.HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": UserSerializer(user).data,
            "created": created,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"detail": "Logged out."})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)