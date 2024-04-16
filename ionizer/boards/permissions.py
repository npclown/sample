from rest_framework.permissions import BasePermission

from role.utils import get_permission_by_user

from .models import Category


class CheckUserRolePost(BasePermission):
    def has_permission(self, request, view):
        category_pk = view.kwargs.get("category_pk")
        category = Category.objects.get(name=category_pk)

        if view.action in ["create", "like", "unlike"]:
            permission = "CREATE_POST"

        elif view.action in ["list", "retrieve", "is_liked"]:
            permission = "READ_POST"

        elif view.action in ["update", "partial_update"]:
            permission = "UPDATE_POST"

        elif view.action in ["destroy", "soft_destroy"]:
            permission = "DELETE_POST"

        else:
            return False

        return get_permission_by_user(request.user, category, permission) > 0


class CheckUserRoleComment(BasePermission):
    def has_permission(self, request, view):
        category_pk = view.kwargs.get("category_pk")
        category = Category.objects.get(name=category_pk)

        if view.action in ["create", "like", "unlike"]:
            permission = "CREATE_COMMENT"

        elif view.action in ["list", "retrieve", "is_liked"]:
            permission = "READ_COMMENT"

        elif view.action in ["update", "partial_update", "accept_comment"]:
            permission = "UPDATE_COMMENT"

        elif view.action in ["destroy", "soft_destroy"]:
            permission = "DELETE_COMMENT"

        else:
            return False

        return get_permission_by_user(request.user, category, permission) > 0
