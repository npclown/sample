from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from attendances.models import Attendance
from boards.models import Comment, Post
from likes.models import Like

from .utils import add_points


@receiver(post_save, sender=get_user_model())
def create_user_point(sender, instance, created, **kwargs):
    if not created:
        return None

    add_points(user=instance, amount=64, description="회원가입 축하 포인트", related_object=instance)


@receiver(post_save, sender=Comment)
def write_comment_point(sender, instance, created, **kwargs):
    if not created:
        return None

    add_points(user=instance.user, amount=4, description="댓글 포인트", related_object=instance)


@receiver(post_save, sender=Post)
def write_post_point(sender, instance, created, **kwargs):
    if not created:
        return None

    label = instance.category.label

    amount = instance.category.categorypoint.write_point or 0

    add_points(user=instance.user, amount=amount, description=f"{label} 글 작성 포인트", related_object=instance)


@receiver(post_save, sender=Like)
def like_point(sender, instance, created, **kwargs):
    if not created:
        return None

    content_type = instance.content_object.__class__.__name__.lower()

    amount = 0
    description = "좋아요 포인트"

    # check post like bonus point
    if content_type == "post":
        label = instance.content_object.category.label
        like_count = instance.content_object.likes.count()

        point = instance.content_object.category.categorypoint

        if point and point.like_count == like_count:
            amount = point.like_point or 0
            description = f"{label} 글 좋아요 보너스 포인트"

    add_points(
        user=instance.content_object.user,
        amount=amount,
        description=description,
        related_object=instance.content_object,
    )


@receiver(post_save, sender=Attendance)
def attendance_point(sender, instance, created, **kwargs):
    if not created:
        return None

    add_points(user=instance.user, amount=2, description="출석체크 포인트", related_object=instance)
