from rest_framework import serializers

from emailuser.serializers import PublicUserSerializer

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(many=False, read_only=True)
    attended_date = serializers.ReadOnlyField()
    attended_time = serializers.ReadOnlyField()

    class Meta:
        model = Attendance
        fields = [
            "user",
            "attended_date",
            "attended_time",
        ]
