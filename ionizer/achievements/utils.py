from activities.utils import activity_assign

from .models import Achievement


def get_achievement(type):
    achievement_list = {
        "top_commenter": {
            "id": 0,
            "title": "댓글왕",
            "description": "댓글을 100개 이상 작성할 경우 달성할 수 있는 업적입니다.",
            "img": "/img/achievements/top_commenter.png",
        },
        "top_writer": {
            "id": 1,
            "title": "글쓰기왕",
            "description": "게시글을 100개 이상 작성할 경우 달성할 수 있는 업적입니다.",
            "img": "/",
        },
        "pro": {"id": 2, "title": "PRO", "description": "PRO 등급을 획득할 경우 달성할 수 있는 업적입니다.", "img": "/"},
    }

    if achievement_list.get(type) is None:
        return None

    return achievement_list[type]


def achievement_assign(type, user):
    try:
        achievement = Achievement.objects.create(type=type, user=user)

        activity_assign(user, achievement)
    except Exception:
        return False

    return True
