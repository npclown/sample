from auditlog.registry import auditlog
from django.contrib.auth import get_user_model
from django.db import models

from tsid_pk.fields import TSIDField


class Attendance(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    attended_date = models.DateField(auto_now_add=True)
    attended_time = models.TimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "attended_date"], name="unique_attendance_per_user_per_day")
        ]
        indexes = [
            models.Index(fields=["attended_date"]),
        ]

    def __str__(self):
        return f"{self.user.nickname} attended {self.attended_time}"


auditlog.register(Attendance)
