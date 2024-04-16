from rest_framework import serializers

from ..models import Navigation


class NavigationSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    label = serializers.ReadOnlyField()
    link = serializers.ReadOnlyField()
    description = serializers.ReadOnlyField()
    order = serializers.ReadOnlyField()

    class Meta:
        model = Navigation
        fields = [
            "id",
            "label",
            "link",
            "description",
            "order",
        ]
