from auditlog.registry import auditlog
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tsid_pk.fields import TSIDField


class Attachment(models.Model):
    id = TSIDField(primary_key=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = TSIDField()
    content_object = GenericForeignKey("content_type", "object_id")
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return self.url


auditlog.register(Attachment)
