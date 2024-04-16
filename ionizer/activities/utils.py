from django.contrib.contenttypes.models import ContentType

from .models import Activity


def activity_assign(user, object):
    try:
        content_type = ContentType.objects.get_for_model(object)

        Activity.objects.create(content_type=content_type, object_id=object.id, user=user)
    except Exception:
        return False

    return True
