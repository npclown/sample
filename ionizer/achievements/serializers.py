from rest_framework import serializers

from emailuser.serializers import PublicUserSerializer

from .models import Achievement


class AchievementSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    type = serializers.ReadOnlyField()
    user = PublicUserSerializer(many=False, read_only=True)

    class Meta:
        model = Achievement
        fields = [
            "id",
            "type",
            "user",
        ]
