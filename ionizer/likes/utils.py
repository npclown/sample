from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

from .models import Like


def is_liked(user_id, object):
    content_type = ContentType.objects.get_for_model(object)
    try:
        Like.objects.get(user_id=user_id, content_type=content_type, object_id=object.id)
    except ObjectDoesNotExist:
        return False
    return True


def like(user_id, object):
    content_type = ContentType.objects.get_for_model(object)
    try:
        Like.objects.get(user_id=user_id, content_type=content_type, object_id=object.id)
    except ObjectDoesNotExist:
        Like.objects.create(user_id=user_id, content_type=content_type, object_id=object.id)


def unlike(user_id, object):
    content_type = ContentType.objects.get_for_model(object)
    try:
        like = Like.objects.get(user_id=user_id, content_type=content_type, object_id=object.id)
        like.delete()
    except ObjectDoesNotExist:
        pass
