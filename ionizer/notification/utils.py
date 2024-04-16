def notify(user, object, label, content):
    from .models import Notification

    Notification.objects.create(
        user=user,
        label=label,
        content=content,
        content_object=object,
    )
