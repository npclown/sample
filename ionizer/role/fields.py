from rest_framework import serializers

from boards.admin.serializers import CategorySerializer
from boards.models import Category


class PermissionableObjectRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Category):
            return {
                "model": {
                    "id": "category",
                    "label": "카테고리",
                },
                "object": CategorySerializer(value).data,
            }
        raise Exception("Unexpected type of permissionable")
