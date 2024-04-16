from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminPointHistoryViewSet

router = routers.DefaultRouter()
router.register(r"points", AdminPointHistoryViewSet, basename="points")

urlpatterns = [
    path("", include(router.urls)),
]
