from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser

from .models import Permission, Role, RolePermission, RoleUser
from .serializers import PermissionSerializer, RolePermissionSerializer, RoleSerializer


class RoleViewSet(viewsets.GenericViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Role.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        object = self.get_object()
        return JsonResponse({"status": "success", "data": RoleSerializer(object).data}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.id == 1:
            return JsonResponse(
                {"status": "error", "data": {"You can not delete default role"}}, status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class PermissionViewSet(viewsets.GenericViewSet):
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Permission.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})


class RolePermissionViewSet(viewsets.GenericViewSet):
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return RolePermission.objects.filter(role=self.kwargs["role_pk"])

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        queryset = RolePermission.objects.filter(role=self.kwargs["role_pk"], permission=self.kwargs["pk"])

        if not queryset.exists():
            instance = RolePermission.objects.create(
                role=Role.objects.get(id=self.kwargs["role_pk"]),
                permission=Permission.objects.get(id=self.kwargs["pk"]),
                value=request.data.get("value", 0),
            )
        else:
            instance = queryset.first()

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class RoleUserViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return RoleUser.objects.filter(role=self.kwargs["role_pk"])
