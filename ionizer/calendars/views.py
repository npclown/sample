from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action

from notification.utils import notify
from points.models import UserPoint
from points.utils import add_points, sub_points

from .models import Applicant, Calendar, Event, Recruit
from .serializers import ApplicantSerializer, CalendarSerializer, EventSerializer

UserModel = get_user_model()


class CalendarViewSet(viewsets.GenericViewSet):
    serializer_class = CalendarSerializer
    lookup_field = "name"

    def get_queryset(self):
        return Calendar.objects.order_by("order").filter(deleted_at__isnull=True).all()

    def list(self, request):
        calendars = self.get_queryset().all()
        serializer = self.get_serializer(calendars, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, name):
        calendar = self.get_object()
        serializer = self.get_serializer(calendar)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class EventViewSet(viewsets.GenericViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        calendar_name = self.kwargs.get("calendar_name")

        if not calendar_name:
            return Event.objects.filter(status="active").all()

        calendar = Calendar.objects.get(name=calendar_name)

        return Event.objects.filter(calendar=calendar, status="active", deleted_at__isnull=True).all()

    def list(self, request, calendar_name):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        start_price = request.query_params.get("start_price")
        end_price = request.query_params.get("end_price")
        is_team = request.query_params.get("is_team")
        is_online = request.query_params.get("is_online")
        search_keyword = request.query_params.get("search_keyword")
        recruit_status = request.query_params.get("recruit_status")

        queryset = self.get_queryset()

        if start_date:
            queryset = queryset.filter(start__gte=start_date)
        if end_date:
            queryset = queryset.filter(end__lte=end_date)
        if start_price:
            queryset = queryset.filter(price__gte=start_price)
        if end_price:
            queryset = queryset.filter(price__lte=end_price)
        if is_team:
            queryset = queryset.filter(is_team=is_team)
        if is_online:
            queryset = queryset.filter(is_online=is_online)
        if search_keyword:
            queryset = queryset.filter(title__contains=search_keyword)
        if recruit_status:
            queryset = queryset.filter(recruit__status=recruit_status)

        serializer = self.get_serializer(queryset, many=True, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, pk, calendar_name):
        event = self.get_object()
        recruit = event.recruit_set.first()

        if recruit is not None and event.end < timezone.now() and recruit.status == "open":
            Recruit.objects.filter(event=event).update(status="close")

        serializer = self.get_serializer(event, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request, calendar_name):
        if not calendar_name:
            return JsonResponse({"status": "error", "message": "캘린더 이름은 필수입니다"}, status=status.HTTP_400_BAD_REQUEST)

        point = UserPoint.objects.get(user=request.user).point

        # validate date
        if request.data.get("start") > request.data.get("end"):
            return JsonResponse(
                {"status": "error", "message": "날짜가 올바르지 않습니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif point < request.data.get("point", 0) * request.data.get("headcount", 0):
            return JsonResponse(
                {"status": "error", "message": "지급할 포인트가 부족합니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif request.data.get("point") > point:
            return JsonResponse(
                {"status": "error", "data": {"message": "포인트가 부족합니다"}}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EventSerializer(data=request.data, context={"request": request, "view": self})

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk, calendar_name):
        event = self.get_object()

        point = UserPoint.objects.get(user=request.user).point

        # validate date
        if request.data.get("start") > request.data.get("end"):
            return JsonResponse(
                {"status": "error", "message": "날짜가 올바르지 않습니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif point < request.data.get("point", 0) * request.data.get("headcount", 0):
            return JsonResponse(
                {"status": "error", "message": "지급할 포인트가 부족합니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif request.data.get("point") > point:
            return JsonResponse(
                {"status": "error", "data": {"message": "포인트가 부족합니다"}}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            event, data=request.data, partial=True, context={"request": request, "view": self}
        )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "이벤트를 찾지 못했습니다"}}, status=status.HTTP_404_NOT_FOUND
            )
        elif request.user != instance.user:
            return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다"}}, status=status.HTTP_403_FORBIDDEN)

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse(
            {"status": "success", "data": {"deleted_at": instance.deleted_at}}, status=status.HTTP_200_OK
        )

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)


class ApplicantViewSet(viewsets.GenericViewSet):
    serializer_class = ApplicantSerializer

    def get_queryset(self):
        event_pk = self.kwargs.get("event_pk")

        return Applicant.objects.filter(event=event_pk).all().order_by("-created_at")

    def list(self, request, *args, **kwargs):
        applicant = self.get_queryset()
        serializer = self.get_serializer(applicant, many=True)

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request, "view": self})

        user = request.user
        event = Event.objects.get(id=kwargs.get("event_pk"))

        recruit = event.recruit_set.first()

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        elif Applicant.objects.filter(event=event, user=user).exists():
            return JsonResponse(
                {"status": "error", "data": {"message": "이미 해당 이벤트에 지원하셨습니다"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif event.user.id == user.id:
            return JsonResponse(
                {"status": "error", "data": {"message": "자신의 이벤트에 지원할 수 없습니다"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif event.status != "active":
            return JsonResponse(
                {"status": "error", "data": {"message": "이벤트가 열려있지 않습니다"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif recruit.headcount <= Applicant.objects.filter(event=event, status="accept").count():
            return JsonResponse(
                {"status": "error", "data": {"message": "모집 인원이 다 찼습니다"}}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        notify(
            event.user,
            event,
            "이벤트 신청자가 있습니다",
            f"{user.nickname}님이 {event.title}에 지원했습니다",
        )

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="manage")
    def manage(self, request, pk, *args, **kwargs):
        applicant = self.get_object()
        recruit = applicant.event.recruit_set.first()

        if request.user != applicant.event.user:
            return JsonResponse({"status": "error", "data": {"message": "권한이 없습니다"}}, status=status.HTTP_403_FORBIDDEN)
        elif applicant.status != "pending":
            return JsonResponse(
                {"status": "error", "data": {"message": "이미 처리된 신청입니다"}}, status=status.HTTP_400_BAD_REQUEST
            )

        user_point = UserPoint.objects.get(user=request.user)

        if request.data.get("status") == "accept":
            # check if user has enough points
            if user_point.point < recruit.point:
                return JsonResponse(
                    {"status": "error", "data": {"message": "포인트가 부족합니다"}}, status=status.HTTP_400_BAD_REQUEST
                )
            elif recruit.headcount <= Applicant.objects.filter(event=applicant.event, status="accept").count():
                return JsonResponse(
                    {"status": "error", "data": {"message": "모집 인원이 다 찼습니다"}},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            add_points(applicant.user, recruit.point, "캘린더 팀원 모집 보상", applicant)
            sub_points(applicant.event.user, recruit.point, "캘린더 팀원 모집 보상 지급", applicant)

            notify(
                applicant.user,
                applicant.event,
                "이벤트 신청결과",
                f"{applicant.event.user.nickname}님이 참가를 승인했습니다! {recruit.point}eV가 지급되었습니다",
            )

        if request.data.get("status") == "reject":
            notify(
                applicant.user,
                applicant.event,
                "이벤트 신청결과",
                f"{applicant.event.user.nickname}님이 참가를 거절하였습니다",
            )

        Applicant.objects.filter(user=applicant.user, event=applicant.event).update(status=request.data.get("status"))

        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
