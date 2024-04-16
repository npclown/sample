from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tsid_pk.fields import TSIDField


class Role(models.Model):
    id = TSIDField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    level = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f"Role: {self.name} ({self.description}))"


class Permission(models.Model):
    id = TSIDField(primary_key=True)
    name = models.CharField(max_length=100)  # CREATE_POST, READ_POST, ...
    value_type = models.CharField(max_length=100)  # BOOLEAN, INTEGER

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name="permissionable")
    object_id = TSIDField()
    permission_object = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return f"Permission: {self.name} ({self.permission_object})"


class RolePermission(models.Model):
    id = TSIDField(primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    value = models.IntegerField(default=0)  # 0: False, 1: True, and another value for custom (minutes, percents, ...)

    def __str__(self):
        return f"{self.role} - {self.permission} - {self.value}"


class RoleUser(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} - {self.role}"
