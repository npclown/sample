from django.urls import include, path
from rest_framework_nested import routers

from .views import AttachmentRemoveViewSet, AttachmentViewSet

router = routers.DefaultRouter()
router.register(r"attachments", AttachmentViewSet, basename="attachments")
router.register(r"attachments", AttachmentRemoveViewSet, basename="attachments-delete")

urlpatterns = [
    path("", include(router.urls)),
]
