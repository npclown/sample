from auditlog.models import LogEntry
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser

from ..models import User
from .serializers import UserSerializer


class AdminUserViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        data = serializer.data
        data["last_active_at"] = (
            LogEntry.objects.filter(actor=instance.id).latest("timestamp").timestamp
            if LogEntry.objects.filter(actor=instance.id).exists()
            else None
        )

        return JsonResponse({"status": "success", "data": data})

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if "is_active" in request.data:
            instance.is_active = request.data["is_active"]

        if "is_staff" in request.data:
            if not request.user.is_superuser:
                return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다."}})
            instance.is_staff = request.data["is_staff"]

        instance.save()

        serializer = UserSerializer(instance)

        return JsonResponse({"status": "success", "data": serializer.data})

    @action(detail=True, methods=["get"])
    def audit_logs(self, request, *args, **kwargs):
        user = self.get_object()
        logs = LogEntry.objects.filter(actor=user.id)
        log_data = []

        for log in logs:
            log_data.append(
                {
                    "action": LogEntry.Action.choices[log.action][1],
                    "actor": str(log.actor),
                    "timestamp": log.timestamp.isoformat(),
                    "changes": log.changes_display_dict,
                    "ip_address": log.remote_addr,
                }
            )

        return JsonResponse({"status": "success", "data": log_data})
