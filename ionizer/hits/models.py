from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tsid_pk.fields import TSIDField


class Hitable(models.Model):
    id = TSIDField(primary_key=True)
    hits = GenericRelation("hits.hit", related_query_name="hitables")

    class Meta:
        abstract = True

    def hit(self, request):
        from .utils import hit

        hit(request, self)


class Hit(models.Model):
    id = TSIDField(primary_key=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = TSIDField()
    content_object = GenericForeignKey("content_type", "object_id")
    count = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"{self.content_type} #{self.object_id}: {self.count} views"
