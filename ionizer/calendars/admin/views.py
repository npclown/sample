from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser

from ..models import Calendar, Event
from .serializers import CalendarSerializer, EventSerializer


class AdminCalendarViewSet(viewsets.GenericViewSet):
    serializer_class = CalendarSerializer
    lookup_field = "name"
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Calendar.objects.filter(deleted_at__isnull=True).all()

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({"status": "success", "data": serializer.data})

    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def partial_update(self, request, name):
        instance = Calendar.objects.get(name=name)
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def soft_destroy(self, request, name):
        instance = Calendar.objects.get(name=name)

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "존재하지 않는 캘린더입니다."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)

    def destroy(self, request, name):
        return self.soft_destroy(request, name)


class AdminEventViewSet(viewsets.GenericViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        calendar_name = self.kwargs.get("calendar_name")

        calendar = Calendar.objects.get(name=calendar_name)

        return Event.objects.filter(calendar=calendar, deleted_at__isnull=True).all()

    def list(self, request, calendar_name):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={"request": request, "view": self})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, pk, calendar_name):
        event = self.get_object()
        serializer = self.get_serializer(event, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request, calendar_name):
        if not calendar_name:
            return JsonResponse(
                {"status": "error", "message": "Calendar name is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # validate date
        if request.data.get("start") > request.data.get("end"):
            return JsonResponse(
                {"status": "error", "message": "Start date should be earlier than end date"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EventSerializer(data=request.data, context={"request": request, "view": self})

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk, calendar_name):
        event = self.get_object()
        serializer = self.get_serializer(
            event, data=request.data, partial=True, context={"request": request, "view": self}
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
