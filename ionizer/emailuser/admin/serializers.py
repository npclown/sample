from django.contrib.auth import get_user_model
from rest_framework import serializers

from points.serializers import UserPointSerializer
from user_profile.serializers import ProfileSerializer

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    email = serializers.CharField()
    nickname = serializers.CharField()
    created_at = serializers.ReadOnlyField()
    is_superuser = serializers.ReadOnlyField()
    is_staff = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    points = UserPointSerializer(source="userpoint", read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = UserModel
        fields = [
            "id",
            "email",
            "nickname",
            "created_at",
            "is_superuser",
            "is_staff",
            "is_active",
            "points",
            "profile",
        ]
