from rest_framework import serializers

from .models import PointHistory, UserPoint


class UserPointSerializer(serializers.Serializer):
    point = serializers.ReadOnlyField()

    class Meta:
        model = UserPoint
        fields = ["point"]


class PointHistorySerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    email = serializers.SerializerMethodField()
    amount = serializers.ReadOnlyField()
    description = serializers.ReadOnlyField()
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = PointHistory
        fields = ["id", "email", "amount", "description", "created_at"]

    def get_email(self, point):
        return point.user.email
