from auditlog.registry import auditlog
from django.db import models

from tsid_pk.fields import TSIDField


class Navigation(models.Model):
    id = TSIDField(primary_key=True)
    label = models.CharField(max_length=30)
    link = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.label}: {self.link}"


auditlog.register(Navigation)
