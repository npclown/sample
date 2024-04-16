from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminBannerViewSet

router = routers.DefaultRouter()
router.register(r"banners", AdminBannerViewSet, basename="banners")

urlpatterns = [
    path("", include(router.urls)),
]
