from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser

from ..models import PointHistory
from ..serializers import PointHistorySerializer


class AdminPointHistoryViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        point_history = PointHistory.objects.all()
        serializer = PointHistorySerializer(point_history, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
