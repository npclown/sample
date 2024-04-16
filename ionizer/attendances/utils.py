from django.db import IntegrityError

from .models import Attendance


def attend(user):
    try:
        Attendance.objects.create(user=user)
        return True
    except IntegrityError:
        return False
