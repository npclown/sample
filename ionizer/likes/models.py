from auditlog.registry import auditlog
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tsid_pk.fields import TSIDField


class Likable(models.Model):
    likes = GenericRelation("likes.like", related_query_name="likable")

    class Meta:
        abstract = True

    def is_liked(self, user):
        from likes.utils import is_liked

        return is_liked(user.id, self)

    def like(self, user):
        from likes.utils import like

        like(user.id, self)

    def unlike(self, user):
        from likes.utils import unlike

        unlike(user.id, self)


class Like(models.Model):
    id = TSIDField(primary_key=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = TSIDField()
    content_object = GenericForeignKey("content_type", "object_id")
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["content_type", "object_id", "user"], name="unique_like_content_user")
        ]
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return f"{self.content_type} #{self.object_id}: {self.user.nickname} liked {self.content_object}"


auditlog.register(Like)
