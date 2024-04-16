from django.urls import include, path
from rest_framework_nested import routers

from .views import PermissionViewSet, RolePermissionViewSet, RoleUserViewSet, RoleViewSet

router = routers.DefaultRouter()
router.register(r"roles", RoleViewSet, basename="roles")
router.register(r"permissions", PermissionViewSet, basename="permissions")

role_permissions_router = routers.NestedSimpleRouter(router, "roles", lookup="role")
role_permissions_router.register(r"permissions", RolePermissionViewSet, basename="permissions")

role_users_router = routers.NestedSimpleRouter(router, "roles", lookup="role")
role_users_router.register(r"users", RoleUserViewSet, basename="users")

urlpatterns = [
    path("admin/", include(router.urls)),
    path("admin/", include(role_permissions_router.urls)),
    path("admin/", include(role_users_router.urls)),
]
