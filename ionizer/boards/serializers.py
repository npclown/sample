from rest_framework import serializers

from achievements.utils import achievement_assign
from activities.utils import activity_assign
from emailuser.serializers import PublicUserSerializer
from question.models import Question
from question.serializers import QuestionSerializer

from .models import Board, Category, Comment, Post


class BoardSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ["name", "label", "description", "type", "order", "categories"]

    def get_categories(self, board):
        return CategorySerializer(board.category_set.all(), many=True).data


class BoardInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = [
            "name",
            "label",
            "description",
            "type",
            "order",
        ]


class CategorySerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "name",
            "label",
            "description",
            "order",
            "posts",
        ]

    def get_posts(self, category):
        queryset = Post.objects.filter(category=category)

        return PostSerializer(queryset, many=True, read_only=True).data


class CategoryInfoSerializer(serializers.ModelSerializer):
    board = BoardInfoSerializer(many=False, read_only=True)

    class Meta:
        model = Category
        fields = [
            "board",
            "name",
            "label",
            "description",
            "order",
        ]


class PostSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    title = serializers.CharField()
    created_at = serializers.ReadOnlyField()

    category = CategoryInfoSerializer(many=False, read_only=True)
    user = PublicUserSerializer(many=False, read_only=True)
    hit_count = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "category",
            "user",
            "title",
            "hit_count",
            "like_count",
            "comment_count",
            "created_at",
        ]

    def get_hit_count(self, post):
        hit = post.hits.first()

        if hit is None:
            hit = post.hits.create()

        return hit.count

    def get_like_count(self, post):
        return post.likes.count()

    def get_comment_count(self, post):
        return self.get_nested_comment_count(post)

    def get_nested_comment_count(self, commentable):
        count = commentable.comments.filter(deleted_at__isnull=True).count()

        for nested_comment in commentable.comments.filter(deleted_at__isnull=True).all():
            count = count + self.get_nested_comment_count(nested_comment)

        return count


class PostDetailSerializer(PostSerializer):
    content = serializers.CharField()
    updated_at = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = PostSerializer.Meta.fields + ["content", "updated_at", "liked"]

    def get_liked(self, post):
        user = self.context.get("request").user

        if user.is_authenticated is False:
            return False

        return post.likes.filter(user=user).exists()

    def create(self, validated_data):
        user = self.context.get("request").user
        category_name = self.context.get("view").kwargs.get("category_pk")

        category = Category.objects.get(name=category_name)
        post = Post.objects.create(category=category, user_id=user.id, **validated_data)

        activity_assign(user, post)

        return post

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)
        instance.save()

        return instance


class PostQuestionSerializer(PostSerializer):
    content = serializers.CharField()
    updated_at = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    question = QuestionSerializer(many=False, read_only=False)

    class Meta:
        model = Post
        fields = PostSerializer.Meta.fields + ["content", "question", "updated_at", "liked"]

    def get_liked(self, post):
        user = self.context.get("request").user

        if user.is_authenticated is False:
            return False

        return post.likes.filter(user=user).exists()

    def create(self, validated_data):
        user = self.context.get("request").user
        category_name = self.context.get("view").kwargs.get("category_pk")

        accepting_points = self.context.get("request").data.get("question", {}).get("accepting_points")

        if accepting_points is None:
            accepting_points = 0
        elif accepting_points == "":
            accepting_points = 0
        elif int(accepting_points) < 0:
            accepting_points = 0
        elif int(accepting_points) > 256:
            accepting_points = 256

        category = Category.objects.get(name=category_name)
        post = Post.objects.create(
            category=category, user_id=user.id, title=validated_data.get("title"), content=validated_data.get("content")
        )

        activity_assign(user, post)

        Question.objects.create(post=post, accepting_points=int(accepting_points))

        return post

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)

        instance.save()

        return instance


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = PublicUserSerializer(many=False, read_only=True)
    content = serializers.CharField()
    comments = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    created_at = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "comments",
            "like_count",
            "created_at",
            "liked",
        ]

    def get_liked(self, comment):
        user = self.context.get("request").user

        if user.is_authenticated is False:
            return False

        return comment.likes.filter(user=user).exists()

    def get_comments(self, comment):
        queryset = Comment.objects.filter(
            parent_content_type__model="comment", parent_object_id=comment.id, deleted_at__isnull=True
        )

        if queryset.exists():
            comments = queryset.all()
            request = self.context.get("request")

            return CommentSerializer(
                comments, many=True, read_only=True, context={"request": request, "view": self}
            ).data

        return []

    def get_like_count(self, comment):
        return comment.likes.count()

    def create(self, validated_data):
        user = self.context.get("request").user
        category_name = self.context.get("view").kwargs.get("category_pk")
        post_id = self.context.get("view").kwargs.get("post_pk")
        comment_id = self.context.get("view").kwargs.get("comment_pk")

        category = Category.objects.get(name=category_name)
        post = Post.objects.get(id=post_id, category=category)

        if comment_id is None:
            comment = Comment.objects.create(
                root_content_object=post, parent_content_object=post, user_id=user.id, **validated_data
            )

        else:
            parent_comment = Comment.objects.get(root_content_type__model="post", root_object_id=post.id, id=comment_id)
            comment = Comment.objects.create(
                root_content_object=post, parent_content_object=parent_comment, user_id=user.id, **validated_data
            )

        activity_assign(user, comment)

        # Achievement check "top_commenter"
        if comment:
            comment_count = Comment.objects.filter(root_content_type__model="comment", user=user).count()

            if comment_count == 100:
                achievement_assign("top_commenter", user)

        return comment
