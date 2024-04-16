from functools import wraps

from django.http import JsonResponse
from rest_framework import status


def user_passes_test(test_func):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if test_func(request.user):
                return view_func(request, *args, **kwargs)
            return JsonResponse({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        return _wrapped_view

    return decorator


# https://stackoverflow.com/questions/48635298/how-to-make-django-login-required-decorator-raise-http401-exception
def login_required(function=None):
    actual_decorator = user_passes_test(
        lambda u: u.is_authenticated,
    )
    if function:
        return actual_decorator(function)
    return actual_decorator
