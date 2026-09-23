from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {"detail": "Something went wrong on our end."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if response.status_code == 400:
        return response

    if isinstance(response.data, dict):
        if "detail" in response.data:
            return response
        first_key = next(iter(response.data))
        first_value = response.data[first_key]
        message = first_value[0] if isinstance(first_value, list) else str(first_value)
        return Response({"detail": message}, status=response.status_code)

    return Response({"detail": str(response.data)}, status=response.status_code)