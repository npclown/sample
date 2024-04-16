import random
import string

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from points.serializers import UserPointSerializer
from user_profile.models import Profile
from user_profile.serializers import ProfileSerializer

from .models import User

UserModel = get_user_model()


class PublicUserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    nickname = serializers.ReadOnlyField()
    points = UserPointSerializer(source="userpoint", read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = UserModel
        fields = [
            "id",
            "nickname",
            "points",
            "profile",
        ]


class UserSerializer(PublicUserSerializer):
    email = serializers.CharField()
    is_email_verified = serializers.ReadOnlyField()
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = UserModel
        fields = PublicUserSerializer.Meta.fields + [
            "email",
            "is_email_verified",
            "created_at",
        ]


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ("username", "email", "password", "password_confirmation")

    def validate(self, data):
        email = data.get("email")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Already exists email")

        password = data.get("password")
        password_confirmation = data.get("password_confirmation")

        if password != password_confirmation:
            raise serializers.ValidationError("Password dot not match with confirmation")

        validate_password(password)

        return data

    def create(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")
        random_12_strings = "".join(random.choices(string.ascii_letters + string.digits, k=12)).lower()

        while True:
            if (
                User.objects.filter(nickname=random_12_strings).exists()
                or Profile.objects.filter(profile_url=random_12_strings).exists()
            ):
                random_12_strings = "".join(random.choices(string.ascii_letters + string.digits, k=12)).lower()
            else:
                break

        user = User.objects.create_user(email=email, password=password, nickname=random_12_strings)

        if user:
            Profile.objects.create(user=user, profile_url=random_12_strings)

        return True
