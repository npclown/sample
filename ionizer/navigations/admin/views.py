from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser

from ..models import Navigation
from .serializers import NavigationSerializer


class AdminNavigationViewSet(viewsets.GenericViewSet):
    serializer_class = NavigationSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Navigation.objects.filter(deleted_at__isnull=True).all()

    def list(self, request):
        navigations = self.get_queryset()
        serializer = NavigationSerializer(navigations, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request):
        Navigation.objects.create(
            label=request.data["label"],
            link=request.data["link"],
            description=request.data["description"],
            order=request.data["order"],
        )

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk):
        navigation = self.get_object()

        for field in ["label", "link", "description", "order"]:
            if field in request.data:
                setattr(navigation, field, request.data[field])

        navigation.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def soft_destroy(self, request, *args, **kwargs):
        navigation = self.get_object()

        if not navigation:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 네비게이션입니다"}},
                status=status.HTTP_404_NOT_FOUND,
            )

        navigation.deleted_at = timezone.now()
        navigation.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)
