from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action

from .models import Attendance
from .serializers import AttendanceSerializer
from .utils import attend


class AttendanceViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["get"], url_path="check")
    def check(self, request, *args, **kwargs):
        date = timezone.now().date()
        attended = False

        queryset = Attendance.objects.filter(user=request.user, attended_date=date)

        if queryset.exists():
            attended = True

        return JsonResponse({"status": "success", "data": {"attended": attended}}, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        date = request.query_params.get("date", timezone.now().date())

        queryset = Attendance.objects.filter(attended_date=date).order_by("attended_time")

        serializer = AttendanceSerializer(queryset, many=True)

        return JsonResponse(
            {"status": "success", "data": {"date": date, "results": serializer.data}},
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        if attend(request.user):
            return JsonResponse({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse(
                {"status": "error", "data": {"message": "오늘은 이미 출석체크를 했습니다"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
