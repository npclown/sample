from auditlog.registry import auditlog
from django.db import models

from tsid_pk.fields import TSIDField


class Banner(models.Model):
    id = TSIDField(primary_key=True)
    image_url = models.CharField(max_length=255)
    title = models.CharField(max_length=100, blank=True, default="")
    description = models.CharField(max_length=255, blank=True, default="")
    order = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.image_url}: {self.title} / {self.description}"


auditlog.register(Banner)
