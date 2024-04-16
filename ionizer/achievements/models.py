from django.contrib.auth import get_user_model
from django.db import models

from tsid_pk.fields import TSIDField


class Achievement(models.Model):
    id = TSIDField(primary_key=True)
    type = models.CharField(max_length=16)
    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.type
