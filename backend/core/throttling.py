from rest_framework.throttling import SimpleRateThrottle


class LoginThrottle(SimpleRateThrottle):
    scope = "login"

    def get_cache_key(self, request, view):
        identifier = ""
        if hasattr(request, "data") and isinstance(request.data, dict):
            identifier = str(request.data.get("identifier", "")).strip().lower()
        return self.cache_format % {
            "scope": self.scope,
            "ident": f"{self.get_ident(request)}:{identifier}",
        }


class PasswordResetThrottle(SimpleRateThrottle):
    scope = "password_reset"

    def get_cache_key(self, request, view):
        identifier = ""
        if hasattr(request, "data") and isinstance(request.data, dict):
            identifier = str(request.data.get("identifier", "")).strip().lower()
        return self.cache_format % {
            "scope": self.scope,
            "ident": f"{self.get_ident(request)}:{identifier}",
        }


class OTPRequestThrottle(SimpleRateThrottle):
    scope = "otp_request"

    def get_cache_key(self, request, view):
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request),
        }