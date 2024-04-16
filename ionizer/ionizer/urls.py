"""
URL configuration for ionizer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.urls import include, path


def health_check(request):
    from django.db import connection
    from django_redis import get_redis_connection

    try:
        connection.ensure_connection()
    except Exception as e:
        return JsonResponse({"status": "error", "message": f"Database connection error: {e}"}, status=500)

    try:
        get_redis_connection("default").ping()
    except Exception as e:
        return JsonResponse({"status": "error", "message": f"Redis connection error: {e}"}, status=500)

    return JsonResponse({"status": "success"})


def get_csrf_token(request):
    return JsonResponse({"status": "success", "data": {"token": get_token(request)}})


urlpatterns = [
    path("health/", health_check),
    path("csrf_token/", get_csrf_token),
    path("", include("emailuser.urls")),
    path("", include("role.urls")),
    path("", include("attendances.urls")),
    path("", include("points.urls")),
    path("", include("user_profile.urls")),
    path("", include("boards.urls")),
    path("", include("navigations.urls")),
    path("", include("calendars.urls")),
    path("", include("banners.urls")),
    path("", include("attachments.urls")),
    path("", include("notification.urls")),
]

urlpatterns += [path("silk/", include("silk.urls", namespace="silk"))]
