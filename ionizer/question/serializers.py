from rest_framework import serializers

from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    accepting_points = serializers.IntegerField()
    accepted_at = serializers.ReadOnlyField()
    accepted_comment = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "accepting_points",
            "accepted_at",
            "accepted_comment",
        ]

    def get_accepted_comment(self, question):
        from boards.models import Comment
        from boards.serializers import CommentSerializer

        request = self.context.get("request")

        if question.accepted_comment is None:
            return None

        comment = Comment.objects.filter(id=question.accepted_comment.id)

        if not comment.exists():
            return None

        return CommentSerializer(
            comment.get(), many=False, read_only=True, context={"request": request, "view": self}
        ).data
