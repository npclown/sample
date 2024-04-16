from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action

from achievements.utils import achievement_assign
from emailuser.permissions import IsAdminOrSelf
from notification.utils import notify
from points.utils import add_points, sub_points
from role.utils import get_permission_by_user

from .models import Board, Category, Comment, Post
from .permissions import CheckUserRoleComment, CheckUserRolePost
from .serializers import (
    BoardSerializer,
    CategorySerializer,
    CommentSerializer,
    PostDetailSerializer,
    PostQuestionSerializer,
    PostSerializer,
)

UserModel = get_user_model()


class BoardViewSet(viewsets.GenericViewSet):
    serializer_class = BoardSerializer
    lookup_field = "name"

    def get_queryset(self):
        return Board.objects.order_by("order").filter(deleted_at__isnull=True).all()

    def list(self, request):
        boards = self.get_queryset().all()
        sort = request.query_params.get("sort")

        if sort == "main":
            boards = Board.objects.filter(deleted_at__isnull=True, is_main=True).all()

        serializer = BoardSerializer(boards, many=True)

        return JsonResponse({"status": "success", "data": serializer.data})

    def retrieve(self, request, name):
        board = self.get_object()
        serializer = self.get_serializer(board)

        return JsonResponse({"status": "success", "data": serializer.data})

    @action(detail=True, methods=["get"], url_path="posts")
    def posts(self, request, name):
        board = self.get_object()
        categories = board.category_set.all()
        queryset = Post.objects.filter(
            category__in=categories, deleted_at__isnull=True, category__deleted_at__isnull=True
        ).order_by("-created_at")

        search_range = request.query_params.get("search_range")
        search_keyword = request.query_params.get("search_keyword")
        sort = request.query_params.get("sort")
        type = request.query_params.get("type")

        if board.type == "question":
            serializer = PostQuestionSerializer(queryset, many=True, context={"request": request, "view": self})
        else:
            serializer = PostSerializer(queryset, many=True, context={"request": request, "view": self})

        if search_keyword is not None:
            if search_range == "all":
                queryset = queryset.filter(
                    Q(title__icontains=search_keyword)
                    | Q(content__icontains=search_keyword)
                    | Q(user__nickname__icontains=search_keyword)
                )
            elif search_range == "title":
                queryset = queryset.filter(title__icontains=search_keyword)
            elif search_range == "content":
                queryset = queryset.filter(content__icontains=search_keyword)
            elif search_range == "nickname":
                queryset = queryset.filter(user__nickname__icontains=search_keyword)

        if sort == "like":
            queryset = queryset.annotate(likes_count=Count("likes")).order_by("-likes_count", "-created_at")
        elif sort == "hit":
            queryset = queryset.order_by("-hits__count", "-created_at")

        if type == "question":
            if sort == "accepting_points":
                queryset = queryset.order_by("-question__accepting_points", "-created_at")
            elif sort == "accepted":
                queryset = queryset.filter(question__accepted_at__isnull=False).order_by("-question__accepted_at")
            elif sort == "not_accepted":
                queryset = queryset.filter(question__accepted_at__isnull=True).order_by("-created_at")
            elif sort == "not_answered":
                queryset = (
                    queryset.annotate(comments_count=Count("comments")).filter(comments_count=0).order_by("-created_at")
                )

        page = self.paginate_queryset(queryset)
        if page is not None:
            if type == "question":
                serializer = PostQuestionSerializer(page, many=True, context={"request": request, "view": self})
            else:
                serializer = PostSerializer(page, many=True, context={"request": request, "view": self})
            return self.get_paginated_response(serializer.data)

        if type == "question":
            serializer = PostQuestionSerializer(queryset, many=True, context={"request": request, "view": self})
        else:
            serializer = PostSerializer(queryset, many=True, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data})


class CategoryViewSet(viewsets.ViewSet):
    serializer_class = CategorySerializer

    def list(self, request, board_name):
        board = Board.objects.get(name=board_name, deleted_at__isnull=True)
        categories = board.category_set.filter(deleted_at__isnull=True).all()

        serializer = CategorySerializer(categories, many=True)

        return JsonResponse({"status": "success", "data": serializer.data})


class TotalPostViewSet(viewsets.GenericViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(
            deleted_at__isnull=True, category__deleted_at__isnull=True, category__board__deleted_at__isnull=True
        ).order_by("-created_at")

    def list(self, request):
        categories = Category.objects.filter(deleted_at__isnull=True, board__deleted_at__isnull=True).all()
        allowed_categories = []

        for category in categories:
            if get_permission_by_user(request.user, category, "READ_POST"):
                allowed_categories.append(category)

        queryset = Post.objects.filter(
            category__in=allowed_categories, category__deleted_at__isnull=True, deleted_at__isnull=True
        )

        search_range = request.query_params.get("search_range")
        search_keyword = request.query_params.get("search_keyword")
        sort = request.query_params.get("sort")
        type = request.query_params.get("type")  # post, question

        if type == "question":
            queryset = queryset.filter(category__board__type="question")
        elif type == "post":
            queryset = queryset.filter(category__board__type="post")

        if search_keyword is not None:
            if search_range == "all":
                queryset = queryset.filter(
                    Q(title__icontains=search_keyword)
                    | Q(content__icontains=search_keyword)
                    | Q(user__nickname__icontains=search_keyword)
                )
            elif search_range == "title":
                queryset = queryset.filter(title__icontains=search_keyword)
            elif search_range == "content":
                queryset = queryset.filter(content__icontains=search_keyword)
            elif search_range == "nickname":
                queryset = queryset.filter(user__nickname__icontains=search_keyword)

        if sort == "like":
            queryset = queryset.annotate(likes_count=Count("likes")).order_by("-likes_count", "-created_at")
        elif sort == "hit":
            queryset = queryset.order_by("-hits__count", "-created_at")

        if type == "question":
            if sort == "accepting_points":
                queryset = queryset.order_by("-question__accepting_points", "-created_at")
            elif sort == "accepted":
                queryset = queryset.filter(question__accepted_at__isnull=False).order_by("-question__accepted_at")
            elif sort == "not_accepted":
                queryset = queryset.filter(question__accepted_at__isnull=True).order_by("-created_at")
            elif sort == "not_answered":
                queryset = (
                    queryset.annotate(comments_count=Count("comments")).filter(comments_count=0).order_by("-created_at")
                )

        page = self.paginate_queryset(queryset)
        if page is not None:
            if type == "question":
                serializer = PostQuestionSerializer(page, many=True, context={"request": request, "view": self})
            else:
                serializer = PostSerializer(page, many=True, context={"request": request, "view": self})
            return self.get_paginated_response(serializer.data)

        if type == "question":
            serializer = PostQuestionSerializer(queryset, many=True, context={"request": request, "view": self})
        else:
            serializer = PostSerializer(queryset, many=True, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data})

    @action(detail=False, methods=["get"], url_path="popular")
    def popular(self, request):
        queryset = (
            self.get_queryset()
            .annotate(
                recent_likes_count=Count(
                    "likes", filter=Q(likes__created_at__gte=timezone.now() - timezone.timedelta(days=1))
                )
            )
            .order_by("-recent_likes_count")[:5]
        )

        serializer = PostDetailSerializer(queryset, many=True, context={"request": request, "view": self})

        return JsonResponse({"status": "success", "data": serializer.data})


class PostViewSet(viewsets.GenericViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAdminOrSelf, CheckUserRolePost]

    def get_queryset(self):
        category_name = self.kwargs.get("category_pk")

        category = Category.objects.filter(name=category_name).first()

        queryset = Post.objects.filter(
            deleted_at__isnull=True, category__deleted_at__isnull=True, category__board__deleted_at__isnull=True
        ).order_by("-created_at")

        if category is not None:
            queryset = queryset.filter(
                category=category, category__deleted_at__isnull=True, category__board__deleted_at__isnull=True
            )

        return queryset

    def list(self, request, *args, **kwargs):
        board_name = self.kwargs.get("board_name")
        board = Board.objects.filter(name=board_name).first()

        search_range = request.query_params.get("search_range")
        search_keyword = request.query_params.get("search_keyword")
        sort = request.query_params.get("sort")

        queryset = self.get_queryset()

        if search_keyword is not None:
            if search_range == "all":
                queryset = queryset.filter(
                    Q(title__icontains=search_keyword)
                    | Q(content__icontains=search_keyword)
                    | Q(user__nickname__icontains=search_keyword)
                )
            elif search_range == "title":
                queryset = queryset.filter(title__icontains=search_keyword)
            elif search_range == "content":
                queryset = queryset.filter(content__icontains=search_keyword)
            elif search_range == "nickname":
                queryset = queryset.filter(user__nickname__icontains=search_keyword)

        if sort == "like":
            queryset = queryset.annotate(likes_count=Count("likes")).order_by("-likes_count", "-created_at")
        elif sort == "hit":
            queryset = queryset.order_by("-hits__count", "-created_at")

        if board.type == "question":
            if sort == "accepting_points":
                queryset = queryset.order_by("-question__accepting_points", "-created_at")
            elif sort == "accepted":
                queryset = queryset.filter(question__accepted_at__isnull=False).order_by("-question__accepted_at")
            elif sort == "not_accepted":
                queryset = queryset.filter(question__accepted_at__isnull=True).order_by("-created_at")
            elif sort == "not_answered":
                queryset = (
                    queryset.annotate(comments_count=Count("comments")).filter(comments_count=0).order_by("-created_at")
                )

        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            if board.type == "question":
                serializer = PostQuestionSerializer(page, many=True, context={"request": request, "view": self})
            else:
                serializer = PostDetailSerializer(page, many=True, context={"request": request, "view": self})
            return self.get_paginated_response(serializer.data)

        if board.type == "question":
            serializer = PostQuestionSerializer(queryset, many=True, context={"request": request, "view": self})
        else:
            serializer = PostDetailSerializer(queryset, many=True, context={"request": request, "view": self})
        return JsonResponse({"status": "success", "data": serializer.data})

    def retrieve(self, request, pk, board_name, category_pk):
        post = self.get_queryset().get(id=pk)

        if post.category.board.type == "question":
            serializer = PostQuestionSerializer(post, context={"request": request, "view": self})
        else:
            serializer = PostDetailSerializer(post, context={"request": request, "view": self})

        post.hit(request)

        return JsonResponse({"status": "success", "data": serializer.data})

    def create(self, request, *args, **kwargs):
        board_name = self.kwargs.get("board_name")

        board = Board.objects.get(name=board_name)

        if board.type == "question":
            if request.data.get("question").get("accepting_points") > request.user.userpoint.point:
                return JsonResponse(
                    {"status": "error", "data": {"message": "포인트가 부족합니다"}}, status=status.HTTP_400_BAD_REQUEST
                )

            serializer = PostQuestionSerializer(data=request.data, context={"request": request, "view": self})
        else:
            serializer = PostDetailSerializer(data=request.data, context={"request": request, "view": self})

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        # Achievement check "top_writer"
        if serializer.data:
            post_count = Post.objects.filter(user=request.user).count()

            if post_count == 100:
                achievement_assign("top_writer", request.user)

        if board.type == "question":
            sub_points(
                request.user,
                request.data.get("question").get("accepting_points"),
                "질문 글 작성 포인트 차감",
                Post.objects.get(id=serializer.data.get("id")),
            )

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        board_name = self.kwargs.get("board_name")

        board = Board.objects.get(name=board_name)

        if board.type == "question":
            serializer = PostQuestionSerializer(
                instance, data=request.data, partial=partial, context={"request": request, "view": self}
            )
        else:
            serializer = PostDetailSerializer(
                instance, data=request.data, partial=partial, context={"request": request, "view": self}
            )

        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "글을 찾지 못했습니다"}}, status=status.HTTP_404_NOT_FOUND
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse(
            {"status": "success", "data": {"deleted_at": instance.deleted_at}}, status=status.HTTP_200_OK
        )

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)

    @action(detail=True, methods=["get"], url_path="like")
    def is_liked(self, request, *args, **kwargs):
        post = self.get_object()

        return JsonResponse({"status": "success", "data": post.is_liked(request.user)}, status=status.HTTP_200_OK)

    @is_liked.mapping.post
    def like(self, request, *args, **kwargs):
        post = self.get_object()
        post.like(request.user)

        return JsonResponse({"status": "success", "data": {"type": "like"}}, status=status.HTTP_200_OK)

    @is_liked.mapping.delete
    def unlike(self, request, *args, **kwargs):
        post = self.get_object()
        post.unlike(request.user)

        return JsonResponse({"status": "success", "data": {"type": "unlike"}}, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.GenericViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAdminOrSelf, CheckUserRoleComment]

    def get_queryset(self):
        category_name = self.kwargs.get("category_pk")
        post_id = self.kwargs.get("post_pk")
        reply_comment_id = self.kwargs.get("comment_pk")
        comment_id = self.kwargs.get("pk")

        category = Category.objects.get(name=category_name)
        post = Post.objects.get(id=post_id, category=category)

        queryset = Comment.objects.filter(deleted_at__isnull=True).order_by("created_at")

        if reply_comment_id is not None:
            # Reply comment
            queryset = queryset.filter(parent_content_type__model="comment", parent_object_id=reply_comment_id)
        elif comment_id is not None:
            queryset = queryset.filter(root_content_type__model="post", root_object_id=post.id)
        else:
            queryset = queryset.filter(parent_content_type__model="post", parent_object_id=post.id)

        return queryset.filter(deleted_at__isnull=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        comment_id = self.kwargs.get("comment_pk")

        if comment_id is None:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True, context={"request": request, "view": self})
                return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context={"request": request, "view": self})
        return JsonResponse({"status": "success", "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request, "view": self})
        return JsonResponse({"status": "success", "data": serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request, "view": self})
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        comment = Comment.objects.get(id=serializer.data.get("id"))
        parent_object_user = (
            UserModel.objects.filter(id=comment.parent_content_object.user.id).exclude(id=comment.user.id).first()
        )

        if parent_object_user:
            notify(
                parent_object_user,
                comment,
                "새로운 댓글이 있습니다",
                f"{comment.user.nickname}님이 댓글을 남겼습니다",
            )

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance, data=request.data, partial=partial, context={"request": request, "view": self}
        )
        if not serializer.is_valid():
            return JsonResponse({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return JsonResponse({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def soft_destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance:
            return JsonResponse(
                {"status": "error", "data": {"message": "댓글을 찾지 못했습니다"}}, status=status.HTTP_404_NOT_FOUND
            )

        instance.deleted_at = timezone.now()
        instance.save()

        return JsonResponse(
            {"status": "success", "data": {"deleted_at": instance.deleted_at}}, status=status.HTTP_200_OK
        )

    def destroy(self, *args, **kwargs):
        return self.soft_destroy(*args, **kwargs)

    @action(detail=True, methods=["get"], url_path="like")
    def is_liked(self, request, *args, **kwargs):
        comment = self.get_object()

        return JsonResponse({"status": "success", "data": comment.is_liked(request.user)}, status=status.HTTP_200_OK)

    @is_liked.mapping.post
    def like(self, request, *args, **kwargs):
        comment = self.get_object()
        comment.like(request.user)

        return JsonResponse({"status": "success", "data": {"type": "like"}}, status=status.HTTP_200_OK)

    @is_liked.mapping.delete
    def unlike(self, request, *args, **kwargs):
        comment = self.get_object()
        comment.unlike(request.user)

        return JsonResponse({"status": "success", "data": {"type": "unlike"}}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="accept")
    def accept_comment(self, request, *args, **kwargs):
        category_name = self.kwargs.get("category_pk")
        post_id = self.kwargs.get("post_pk")

        category = Category.objects.get(name=category_name)
        board = category.board
        post = Post.objects.get(id=post_id, category=category)
        comment = self.get_object()

        if board.type != "question":
            return JsonResponse(
                {"status": "error", "data": {"message": "질문이 아닙니다"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        post.question.accepted_comment = comment
        post.question.accepted_at = timezone.now()
        post.question.save()

        # Add accepting comment points
        add_points(
            user=comment.user,
            amount=post.question.accepting_points,
            description="Q&A 질문 채택 포인트",
            related_object=comment,
        )

        notify(
            comment.user,
            post,
            "답변이 채택되었습니다",
            f"{post.title} 답변이 채택되었습니다",
        )

        return JsonResponse(
            {"status": "success", "data": CommentSerializer(comment, context={"request": request, "view": self}).data},
            status=status.HTTP_200_OK,
        )
