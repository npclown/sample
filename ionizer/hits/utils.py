from django.contrib.contenttypes.models import ContentType

from .models import Hit


def hit(request, obj):
    content_type = ContentType.objects.get_for_model(obj)
    obj_id = obj.id
    model_name = "_".join(content_type.natural_key())

    hit_id = f"hit:{model_name}:{obj_id}"
    if hit_id not in request.session:
        request.session[hit_id] = True

        hit, _ = Hit.objects.get_or_create(content_type=content_type, object_id=obj_id)
        hit.count += 1
        hit.save()
