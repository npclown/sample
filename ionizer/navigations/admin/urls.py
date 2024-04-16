from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminNavigationViewSet

router = routers.DefaultRouter()
router.register(r"navigations", AdminNavigationViewSet, basename="navigations")

urlpatterns = [
    path("", include(router.urls)),
]
