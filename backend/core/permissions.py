from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsPassenger(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PASSENGER")


class IsProvider(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PROVIDER")


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "ADMIN")


class IsVerifiedProvider(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "PROVIDER"
            and hasattr(request.user, "provider_profile")
            and request.user.provider_profile.verification_status == "VERIFIED"
        )


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "passenger", None) and obj.passenger.user == request.user