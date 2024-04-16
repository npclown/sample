from django.http import JsonResponse
from rest_framework import status, viewsets

from .models import Banner
from .serializers import BannerSerializer


class BannerViewSet(viewsets.GenericViewSet):
    serializer_class = BannerSerializer

    def get_queryset(self):
        return Banner.objects.filter(deleted_at__isnull=True).all()

    def list(self, request):
        banners = self.get_queryset()
        serializer = self.get_serializer(banners, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
