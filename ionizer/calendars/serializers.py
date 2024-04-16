from rest_framework import serializers

from emailuser.serializers import PublicUserSerializer

from .models import Applicant, Calendar, Event, Recruit


class CalendarInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = [
            "name",
            "label",
            "description",
            "order",
        ]


class RecruitSerializer(serializers.ModelSerializer):
    headcount = serializers.IntegerField()
    point = serializers.IntegerField()
    note = serializers.CharField(max_length=255, default="")
    status = serializers.CharField(max_length=16, default="open")

    count = serializers.SerializerMethodField()
    applicant_status = serializers.SerializerMethodField()
    accept_count = serializers.SerializerMethodField()

    class Meta:
        model = Recruit
        fields = ["headcount", "point", "note", "status", "count", "accept_count", "applicant_status"]

    def get_count(self, recruit):
        return Applicant.objects.filter(event=recruit.event).count()

    def get_applicant_status(self, recruit):
        user = self.context["request"].user

        if not hasattr(self.context["request"], "user"):
            return "no_applicant"
        elif not Applicant.objects.filter(event=recruit.event, user=user).exists():
            return "no_applicant"

        return Applicant.objects.filter(event=recruit.event, user=user).first().status

    def get_accept_count(self, recruit):
        return Applicant.objects.filter(event=recruit.event, status="accept").count()


class EventSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    calendar = CalendarInfoSerializer(many=False, read_only=True)
    user = PublicUserSerializer(many=False, read_only=True)
    created_at = serializers.ReadOnlyField()

    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=255)
    is_team = serializers.BooleanField(default=False)
    is_online = serializers.BooleanField(default=False)
    color = serializers.CharField(max_length=10)
    status = serializers.ReadOnlyField()
    price = serializers.IntegerField(required=False, default=0)

    recruit = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "calendar",
            "user",
            "start",
            "end",
            "title",
            "description",
            "is_team",
            "is_online",
            "color",
            "status",
            "price",
            "recruit",
            "owner",
            "created_at",
        ]

    def get_owner(self, event):
        if not hasattr(self.context["request"], "user"):
            return False

        return event.user.id == self.context["request"].user.id

    def get_recruit(self, event):
        recruit = event.recruit_set.first()

        request = self.context["request"]
        view = self.context["view"]

        if recruit is None:
            return None

        return RecruitSerializer(recruit, many=False, read_only=True, context={"request": request, "view": view}).data

    def create(self, validated_data):
        user = self.context["request"].user
        request_data = self.context["request"].data
        calendar_name = self.context["view"].kwargs["calendar_name"]

        calendar = Calendar.objects.get(name=calendar_name)
        event = Event.objects.create(calendar=calendar, user=user, **validated_data)

        if request_data.get("type") == "recruit":
            Recruit.objects.create(
                event=event,
                point=request_data.get("point"),
                headcount=request_data.get("headcount"),
                note=request_data.get("note"),
            )

        return event

    def update(self, instance, validated_data):
        request_data = self.context["request"].data

        recruit = instance.recruit_set.first()

        applicant_count = Applicant.objects.filter(event=instance).count()

        # create recruit
        if applicant_count == 0 and recruit is None and request_data.get("type") == "recruit":
            recruit = Recruit.objects.create(
                event=instance,
                point=request_data.get("point"),
                headcount=request_data.get("headcount"),
                note=request_data.get("note"),
            )

        # update recruit
        if applicant_count == 0 and recruit and request_data.get("type") == "recruit":
            recruit.point = request_data.get("point")
            recruit.headcount = request_data.get("headcount")
            recruit.note = request_data.get("note")
            recruit.save()

        return super().update(instance, validated_data)


class ApplicantSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    event = EventSerializer(many=False, read_only=True)
    user = PublicUserSerializer(many=False, read_only=True)
    status = serializers.ReadOnlyField()
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Applicant
        fields = [
            "id",
            "event",
            "user",
            "status",
            "created_at",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        event = Event.objects.get(id=self.context["view"].kwargs.get("event_pk"))

        recruit = event.recruit_set.first()

        applicant = Applicant.objects.create(event=event, user=user, **validated_data)

        # update recruit status to close
        if recruit.headcount == Applicant.objects.filter(event=event, status="accept").count():
            Recruit.objects.filter(event=event).update(status="close")

        return applicant


class CalendarSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Calendar
        fields = ["name", "label", "description", "order", "events"]
