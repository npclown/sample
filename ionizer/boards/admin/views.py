from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser

from role.utils import create_instance_permission

from ..models import Board, Category, CategoryPoint
from .serializers import BoardSerializer, CategoryPointSerializer, CategorySerializer


class AdminBoardViewSet(viewsets.GenericViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Board.objects.filter(deleted_at__isnull=True).all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})

    def create(self, request):
        serializer = BoardSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=400)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data})

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 게시판입니다."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)


class AdminCategoryViewSet(viewsets.GenericViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Category.objects.filter(deleted_at__isnull=True, board__deleted_at__isnull=True).all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={**request.data})

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=400)

        serializer.save()

        category = Category.objects.get(name=request.data.get("name"))

        create_instance_permission(category, "CREATE_POST", "BOOLEAN")
        create_instance_permission(category, "READ_POST", "BOOLEAN")
        create_instance_permission(category, "UPDATE_POST", "BOOLEAN")
        create_instance_permission(category, "DELETE_POST", "BOOLEAN")

        create_instance_permission(category, "CREATE_COMMENT", "BOOLEAN")
        create_instance_permission(category, "READ_COMMENT", "BOOLEAN")
        create_instance_permission(category, "UPDATE_COMMENT", "BOOLEAN")
        create_instance_permission(category, "DELETE_COMMENT", "BOOLEAN")

        return JsonResponse({"status": "success", "data": serializer.data}, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data})

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 카테고리입니다."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)

    @action(detail=True, methods=["PATCH"], url_path="point")
    def update_category_point(self, request, *args, **kwargs):
        category = self.get_object()
        category_point, _ = CategoryPoint.objects.get_or_create(category=category)

        serializer = CategoryPointSerializer(category_point, data=request.data)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
