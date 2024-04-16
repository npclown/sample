from auditlog.registry import auditlog
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from hits.models import Hitable
from likes.models import Likable
from tsid_pk.fields import TSIDField


class Board(models.Model):
    id = TSIDField(primary_key=True)
    name = models.CharField(max_length=16, unique=True)
    label = models.CharField(max_length=16)
    description = models.CharField(max_length=64)
    type = models.CharField(default="post", max_length=16)  # post, question
    order = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, default=None)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.label


class Category(models.Model):
    id = TSIDField(primary_key=True)
    board = models.ForeignKey(to=Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=16, unique=True)
    label = models.CharField(max_length=16)
    description = models.CharField(max_length=64)
    order = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.label


class CategoryPoint(models.Model):
    category = models.OneToOneField(to=Category, on_delete=models.CASCADE, primary_key=True)
    write_point = models.IntegerField(default=0)
    like_point = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)

    class Meta:
        ordering = ["category"]

    def __str__(self):
        return f"{self.board.label}: 기본 {self.write_point} eV / 좋아요 {self.like_point} eV / 좋아요 수: {self.like_count} eV"


class Post(Likable, Hitable, models.Model):
    id = TSIDField(primary_key=True)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=64)
    content = models.TextField()
    comments = GenericRelation("Comment", content_type_field="parent_content_type", object_id_field="parent_object_id")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.category.board.name}/{self.category.name}] {self.user.nickname}: {self.title}"


class Comment(Likable, models.Model):
    id = TSIDField(primary_key=True)
    root_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name="root_content_type")
    root_object_id = TSIDField()
    root_content_object = GenericForeignKey("root_content_type", "root_object_id")

    parent_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name="parent_content_type")
    parent_object_id = TSIDField()
    parent_content_object = GenericForeignKey("parent_content_type", "parent_object_id")

    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    comments = GenericRelation("self", content_type_field="parent_content_type", object_id_field="parent_object_id")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)

    def __str__(self):
        return f"{self.user.nickname}: {self.content}"


auditlog.register(Board)
auditlog.register(Category)
auditlog.register(Comment)
auditlog.register(Post)
