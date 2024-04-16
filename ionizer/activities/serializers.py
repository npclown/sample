from rest_framework import serializers

from achievements.models import Achievement
from achievements.serializers import AchievementSerializer
from boards.models import Comment, Post
from boards.serializers import CommentSerializer, PostSerializer
from emailuser.serializers import PublicUserSerializer

from .models import Activity


class ActivityObjectRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Post):
            return PostSerializer(value).data
        elif isinstance(value, Comment):
            return CommentSerializer(value, context=self.context).data
        elif isinstance(value, Achievement):
            return AchievementSerializer(value).data
        raise Exception("Unexpected type of activity")


class ActivitiesSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = PublicUserSerializer(many=False, read_only=True)
    activity_type = serializers.SerializerMethodField()
    activity_object = ActivityObjectRelatedField(read_only=True)
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Activity
        fields = [
            "id",
            "user",
            "activity_type",
            "activity_object",
            "created_at",
        ]

    def get_activity_type(self, obj):
        return obj.activity_object.__class__.__name__.lower()
