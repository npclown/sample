from django.urls import include, path
from rest_framework_nested import routers

from .views import AdminCalendarViewSet, AdminEventViewSet

router = routers.DefaultRouter()
router.register(r"calendars", AdminCalendarViewSet, basename="calendars")

events_router = routers.NestedSimpleRouter(router, "calendars", lookup="calendar")
events_router.register(r"events", AdminEventViewSet, basename="events")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(events_router.urls)),
]
