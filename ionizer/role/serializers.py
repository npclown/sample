from rest_framework import serializers

from emailuser.admin.serializers import UserSerializer

from .fields import PermissionableObjectRelatedField
from .models import Permission, Role, RolePermission, RoleUser


class RoleSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    name = serializers.CharField()
    description = serializers.CharField()
    level = serializers.CharField(allow_null=True)

    class Meta:
        model = Role
        fields = [
            "id",
            "name",
            "description",
            "level",
        ]


class PermissionSerializer(serializers.ModelSerializer):
    permission_object = PermissionableObjectRelatedField(read_only=True)

    class Meta:
        model = Permission
        fields = [
            "id",
            "name",
            "value_type",
            "permission_object",
        ]


class RolePermissionSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    role = RoleSerializer(read_only=True)
    permission = PermissionSerializer(read_only=True)
    value = serializers.IntegerField(default=0)

    class Meta:
        model = RolePermission
        fields = [
            "id",
            "role",
            "permission",
            "value",
        ]


class RoleUserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = RoleUser
        fields = [
            "id",
            "user",
            "role",
        ]
