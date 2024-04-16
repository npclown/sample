from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser

from ..models import Banner
from ..serializers import BannerSerializer


class AdminBannerViewSet(viewsets.GenericViewSet):
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Banner.objects.filter(deleted_at__isnull=True).all()

    def list(self, request):
        banners = self.get_queryset()
        serializer = self.get_serializer(banners, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 배너입니다."}}, status=status.HTTP_404_NOT_FOUND
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)
