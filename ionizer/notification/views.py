from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.GenericViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def list(self, request):
        queryset = self.get_queryset().order_by("-created_at")
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data}, safe=False, status=status.HTTP_200_OK)

    def destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save()
        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def read_all(self, request):
        self.get_queryset().filter(read_at__isnull=True).update(read_at=timezone.now())
        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def read(self, request, pk):
        notification = self.get_queryset().filter(read_at__isnull=True).get(pk=pk)

        if notification is None:
            return JsonResponse(
                {"status": "error", "message": "Already read or not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        notification.read_at = timezone.now()
        notification.save()
        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
