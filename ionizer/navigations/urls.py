from django.urls import include, path
from rest_framework_nested import routers

from .views import NavigationViewSet

router = routers.DefaultRouter()

router.register(r"navigations", NavigationViewSet, basename="navigations")

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", include("navigations.admin.urls")),
]
