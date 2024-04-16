from django.http import JsonResponse
from rest_framework import status, viewsets

from .models import Navigation
from .serializers import NavigationSerializer


class NavigationViewSet(viewsets.ViewSet):
    def list(self, request):
        navigations = Navigation.objects.filter(deleted_at__isnull=True).all()
        serializer = NavigationSerializer(navigations, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
