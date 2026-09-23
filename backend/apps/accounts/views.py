from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from core.throttling import LoginThrottle, PasswordResetThrottle, OTPRequestThrottle

from .models import User, UserStatus
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer, UserUpdateSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    VerifyPhoneSerializer, VerifyPhoneConfirmSerializer,
)
from .services import auth_service, otp_service, token_service


def _dispatch_otp(phone, code, purpose="verification"):
    """Best-effort dispatch. Falls back to console if Celery is unavailable."""
    msg = f"Your Falcon Rider {purpose} code is {code}. Valid for 10 minutes."
    try:
        from apps.accounts.tasks.notification_tasks import dispatch_sms
        dispatch_sms.delay(phone, msg)
    except Exception:
        print(f"\n📱 [OTP] {phone}: {msg}\n")


def _login_response(user):
    token = token_service.issue_token(user)
    return Response({"token": token, "user": UserSerializer(user).data})


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "anon"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return _login_response(user)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data["identifier"]
        password = serializer.validated_data["password"]

        user, error = auth_service.authenticate_credentials(identifier, password)
        if error == "invalid_credentials":
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        if error == "suspended":
            return Response({"detail": "Account suspended. Contact support."},
                            status=status.HTTP_403_FORBIDDEN)
        return _login_response(user)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token_service.revoke_token(request.user)
        return Response({"detail": "Logged out successfully"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data["identifier"]

        user = auth_service.resolve_user_by_identifier(identifier)
        if user and user.phone_number:
            code = otp_service.generate_otp("password_reset", identifier)
            _dispatch_otp(user.phone_number, code, purpose="password reset")

        return Response({"detail": "If an account exists, a reset code has been sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        identifier = data["identifier"]

        try:
            otp_service.verify_otp("password_reset", identifier, data["otp"])
        except DjangoValidationError:
            return Response({"otp": ["Invalid or expired code"]},
                            status=status.HTTP_400_BAD_REQUEST)

        user = auth_service.resolve_user_by_identifier(identifier)
        if not user:
            return Response({"otp": ["Invalid or expired code"]},
                            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user.set_password(data["new_password"])
            user.save(update_fields=["password", "updated_at"])
            token_service.revoke_all_tokens(user)

        return Response({"detail": "Password reset successful. Please log in."})


class VerifyPhoneView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [OTPRequestThrottle]

    def post(self, request):
        serializer = VerifyPhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone_number"]

        code = otp_service.generate_otp("verify_phone", phone)
        _dispatch_otp(phone, code, purpose="phone verification")

        return Response({"detail": "Verification code sent"})


class VerifyPhoneConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPhoneConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = request.user.phone_number
        if not phone:
            return Response({"detail": "No phone number on account."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_service.verify_otp("verify_phone", phone, serializer.validated_data["otp"])
        except DjangoValidationError:
            return Response({"otp": ["Invalid or expired code"]},
                            status=status.HTTP_400_BAD_REQUEST)

        request.user.is_verified = True
        request.user.save(update_fields=["is_verified", "updated_at"])
        return Response({"detail": "Phone verified", "is_verified": True})
