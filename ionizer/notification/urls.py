from django.urls import include, path
from rest_framework_nested import routers

from .views import NotificationViewSet

router = routers.DefaultRouter()
router.register(r"notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("", include(router.urls)),
]
