# Create your models here.
from auditlog.registry import auditlog
from django.db import models


class Question(models.Model):
    post = models.OneToOneField(to="boards.Post", on_delete=models.CASCADE, primary_key=True)
    accepting_points = models.PositiveSmallIntegerField()
    accepted_at = models.DateTimeField(null=True, default=None)
    accepted_comment = models.OneToOneField(to="boards.Comment", on_delete=models.CASCADE, null=True, default=None)


auditlog.register(Question)
