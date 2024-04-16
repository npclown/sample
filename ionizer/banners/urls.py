from django.urls import include, path
from rest_framework_nested import routers

from .views import BannerViewSet

router = routers.DefaultRouter()

router.register(r"banners", BannerViewSet, basename="banners")

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", include("banners.admin.urls")),
]
