from django.urls import include, path
from rest_framework_nested import routers

from .views import BoardViewSet, CategoryViewSet, CommentViewSet, PostViewSet, TotalPostViewSet

total_post_router = routers.DefaultRouter()
total_post_router.register(r"posts", TotalPostViewSet, basename="posts")

router = routers.DefaultRouter()
router.register(r"boards", BoardViewSet, basename="boards")

categories_router = routers.NestedSimpleRouter(router, "boards", lookup="board")
categories_router.register(r"categories", CategoryViewSet, basename="categories")

posts_router = routers.NestedSimpleRouter(categories_router, "categories", lookup="category")
posts_router.register(r"posts", PostViewSet, basename="posts")

comments_router = routers.NestedSimpleRouter(posts_router, "posts", lookup="post")
comments_router.register(r"comments", CommentViewSet, basename="comments")

nested_comments_router = routers.NestedSimpleRouter(comments_router, "comments", lookup="comment")
nested_comments_router.register(r"comments", CommentViewSet, basename="nested_comments")

urlpatterns = [
    path("", include(total_post_router.urls)),
    path("", include(router.urls)),
    path("", include(categories_router.urls)),
    path("", include(posts_router.urls)),
    path("", include(comments_router.urls)),
    path("", include(nested_comments_router.urls)),
    path("admin/", include("boards.admin.urls")),
]
