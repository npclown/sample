from django.urls import include, path
from rest_framework_nested import routers

from .views import AttendanceViewSet

router = routers.DefaultRouter()
router.register(r"attendances", AttendanceViewSet, basename="attendances")

urlpatterns = [
    path("", include(router.urls)),
]
