from auditlog.registry import auditlog
from django.contrib.auth import get_user_model
from django.db import models

from tsid_pk.fields import TSIDField


class Calendar(models.Model):
    id = TSIDField(primary_key=True)
    name = models.CharField(max_length=16, unique=True)
    label = models.CharField(max_length=16)
    description = models.CharField(max_length=64)
    order = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.label


class Event(models.Model):
    id = TSIDField(primary_key=True)
    calendar = models.ForeignKey(to=Calendar, on_delete=models.CASCADE)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    start = models.DateTimeField()
    end = models.DateTimeField()
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    is_team = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    color = models.CharField(max_length=10)
    status = models.CharField(max_length=16, default="pending")  # TODO const status
    price = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user}: {self.title} ({self.start} ~ {self.end})"


class Recruit(models.Model):
    id = TSIDField(primary_key=True)
    event = models.ForeignKey(to=Event, on_delete=models.CASCADE)
    headcount = models.IntegerField()
    point = models.IntegerField()
    note = models.CharField(max_length=255, default="")
    status = models.CharField(max_length=16, default="open")  # TODO const status


class Applicant(models.Model):
    id = TSIDField(primary_key=True)
    event = models.ForeignKey(to=Event, on_delete=models.CASCADE)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    status = models.CharField(max_length=16, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)


auditlog.register(Event)
auditlog.register(Recruit)
auditlog.register(Applicant)
