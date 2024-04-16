from rest_framework import serializers

from emailuser.serializers import PublicUserSerializer

from ..models import Calendar, Event, Recruit


class CalendarSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    name = serializers.CharField(max_length=16)
    label = serializers.CharField(max_length=16)
    description = serializers.CharField(max_length=64)
    order = serializers.IntegerField(default=0)

    class Meta:
        model = Calendar
        fields = [
            "id",
            "name",
            "label",
            "description",
            "order",
        ]


class RecruitSerializer(serializers.ModelSerializer):
    headcount = serializers.IntegerField()
    point = serializers.IntegerField()
    note = serializers.CharField(max_length=255, default="")

    class Meta:
        model = Recruit
        fields = [
            "headcount",
            "point",
            "note",
        ]


class EventSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    calendar = CalendarSerializer(many=False, read_only=True)
    user = PublicUserSerializer(many=False, read_only=True)
    created_at = serializers.ReadOnlyField()

    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=255)
    is_team = serializers.BooleanField(default=False)
    is_online = serializers.BooleanField(default=False)
    color = serializers.CharField(max_length=10)
    status = serializers.CharField(max_length=16, default="active")
    price = serializers.IntegerField(required=False)

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

        if recruit is None:
            return None

        return RecruitSerializer(recruit, many=False, read_only=True).data

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

        # create recruit
        if recruit is None and request_data.get("type") == "recruit":
            recruit = Recruit.objects.create(
                event=instance,
                point=request_data.get("point"),
                headcount=request_data.get("headcount"),
                note=request_data.get("note"),
            )

        # update recruit
        if recruit and request_data.get("type") == "recruit":
            recruit.point = request_data.get("point")
            recruit.headcount = request_data.get("headcount")
            recruit.note = request_data.get("note")
            recruit.save()

        return super().update(instance, validated_data)
