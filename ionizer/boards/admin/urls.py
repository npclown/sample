from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminBoardViewSet, AdminCategoryViewSet

router = routers.DefaultRouter()
router.register(r"boards", AdminBoardViewSet, basename="boards")

categories_router = routers.DefaultRouter()
categories_router.register(r"categories", AdminCategoryViewSet, basename="categories")

urlpatterns = [
    path("", include(categories_router.urls)),
    path("", include(router.urls)),
]
