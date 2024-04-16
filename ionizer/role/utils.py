from django.contrib.contenttypes.models import ContentType

from .models import Permission, Role


def create_instance_permission(instance, name, value_type):
    content_type = ContentType.objects.get_for_model(instance)
    return Permission.objects.create(
        name=name,
        value_type=value_type,
        content_type=content_type,
        object_id=instance.id,
    )


def get_role_by_user(user):
    if not user.is_authenticated:
        return Role.objects.get(pk="0000000000000")
    elif user.roleuser_set.exists():
        return user.roleuser_set.first().role
    elif user.profile.level is not None:
        role = Role.objects.filter(level=user.profile.level).first()
        if role is not None:
            return role

    return Role.objects.get(pk="0000000000000")


def get_permission_by_user(user, permissionable, name):
    role = get_role_by_user(user)
    content_type = ContentType.objects.get_for_model(permissionable)

    permission_queryset = Permission.objects.filter(
        name=name,
        content_type=content_type,
        object_id=permissionable.id,
    )

    if not permission_queryset.exists():
        return 0

    role_permission_queryset = role.rolepermission_set.filter(permission=permission_queryset.first())

    return role_permission_queryset.first().value if role_permission_queryset.exists() else 0
