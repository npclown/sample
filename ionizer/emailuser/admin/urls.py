from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminUserViewSet

router = routers.DefaultRouter()
router.register(r"users", AdminUserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]
