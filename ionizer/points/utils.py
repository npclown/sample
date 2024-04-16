def add_points(user, amount, description, related_object=None):
    from .models import UserPoint

    if (amount > 0) and (user.is_authenticated is False):
        return None

    user_point, created = UserPoint.objects.get_or_create(user=user)
    user_point.add_points(amount=amount, description=description, related_object=related_object)


def sub_points(user, amount, description, related_object=None):
    from .models import UserPoint

    if (amount > 0) and (user.is_authenticated is False):
        return None

    user_point, created = UserPoint.objects.get_or_create(user=user)
    user_point.sub_points(amount=amount, description=description, related_object=related_object)
