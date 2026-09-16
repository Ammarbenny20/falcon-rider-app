from rest_framework.permissions import BasePermission


class IsPassenger(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PASSENGER")


class IsProvider(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PROVIDER")


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "ADMIN")


class IsJourneyOwnerPassenger(BasePermission):
    """A passenger may only touch their own journey."""
    def has_object_permission(self, request, view, obj):
        return obj.passenger_id == request.user.id


class IsJourneyOwnerProvider(BasePermission):
    """A provider may only touch a journey they've been assigned."""
    def has_object_permission(self, request, view, obj):
        provider = getattr(request.user, "provider_profile", None)
        return bool(provider and obj.provider_id == provider.id)