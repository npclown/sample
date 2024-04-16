from auditlog.registry import auditlog
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models, transaction
from django.utils import timezone

from tsid_pk.fields import TSIDField


class UserPoint(models.Model):
    user = models.OneToOneField(to=get_user_model(), on_delete=models.CASCADE, primary_key=True)
    point = models.BigIntegerField(default=0)

    @transaction.atomic
    def add_points(self, amount, description, related_object=None):
        if amount <= 0:
            return False

        self.point += amount
        self.save()
        PointHistory.objects.create(
            user=self.user, amount=amount, description=description, content_object=related_object
        )

    @transaction.atomic
    def sub_points(self, amount, description, related_object=None):
        if amount <= 0:
            return False

        if self.point < amount:
            raise ValueError("포인트가 부족합니다")

        self.point -= amount
        self.save()
        PointHistory.objects.create(
            user=self.user, amount=-amount, description=description, content_object=related_object
        )


class PointHistory(models.Model):
    id = TSIDField(primary_key=True)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    amount = models.IntegerField()
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = TSIDField(null=True)
    content_object = GenericForeignKey("content_type", "object_id")

    def __str__(self) -> str:
        return f"{self.user}: {self.description} ({self.amount})"


auditlog.register(UserPoint)
auditlog.register(PointHistory)
