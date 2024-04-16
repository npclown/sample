from django.urls import include, path

urlpatterns = [
    path("admin/", include("points.admin.urls")),
]
