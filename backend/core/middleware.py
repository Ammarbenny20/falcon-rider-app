"""
Adds an X-Request-ID header to every response. Used by audit logging
and error tracking to correlate requests across logs.
"""
import uuid


class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Use incoming header if provided (from load balancer or client)
        request.request_id = request.META.get("HTTP_X_REQUEST_ID") or str(uuid.uuid4())

        response = self.get_response(request)
        response["X-Request-ID"] = request.request_id
        return response
