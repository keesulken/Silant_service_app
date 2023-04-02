from functools import wraps
from rest_framework.response import Response
from rest_framework import status


def superuser_or_management_test(user):
    if user.type == 'MFR' or user.is_superuser:
        return True
    return False


def superuser_or_management_access():
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not superuser_or_management_test(request.user):
                return Response(status=status.HTTP_403_FORBIDDEN)
            return view(request, *args, **kwargs)
        return _wrapped_view
    return decorator


def decorator(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            return view_func
        return Response(status=status.HTTP_403_FORBIDDEN)
    return wrapper
