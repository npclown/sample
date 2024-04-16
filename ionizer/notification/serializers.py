from rest_framework import serializers

from boards.models import Comment, Post
from calendars.models import Event

from .models import Notification


class NotificationSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    label = serializers.ReadOnlyField()
    content = serializers.ReadOnlyField()
    link = serializers.SerializerMethodField()
    created_at = serializers.ReadOnlyField()
    read_at = serializers.ReadOnlyField()
    deleted_at = serializers.ReadOnlyField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "label",
            "content",
            "link",
            "created_at",
            "read_at",
        ]

    def get_link(self, notification):
        if isinstance(notification.content_object, Post):
            post = notification.content_object

            if post.category.board.type == "question":
                return f"/questions/{post.category.board.name}/categories/{post.category.name}/posts/{post.id}"

            return f"/boards/{post.category.board.name}/categories/{post.category.name}/posts/{post.id}"
        elif isinstance(notification.content_object, Comment):
            post = notification.content_object.root_content_object

            if post.category.board.type == "question":
                return f"/questions/{post.category.board.name}/categories/{post.category.name}/posts/{post.id}"

            return f"/boards/{post.category.board.name}/categories/{post.category.name}/posts/{post.id}"
        elif isinstance(notification.content_object, Event):
            event = notification.content_object

            return f"/calendars/{event.calendar.name}"
