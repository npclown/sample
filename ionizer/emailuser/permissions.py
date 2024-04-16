from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAdminUser


# https://github.com/sebastibe/django-rest-skeleton/blob/master/api/users/permissions.py
class IsAdminOrSelf(IsAdminUser):
    """
    Allow access to admin users or the user himself.
    """

    def has_permission(self, request, view):
        return True  # Skipping non object permissions

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        elif request.user and obj == request.user:
            return True
        elif request.user and obj.user and obj.user == request.user:
            return True
        return False


class IsVerifiedEmailOrReadOnly(BasePermission):
    """
    Allow access to verified email users or read-only access to others.
    """

    def has_permission(self, request, view):
        return bool(
            (request.method in SAFE_METHODS)
            or (request.user and request.user.is_authenticated and request.user.is_email_verified)
        )
