from django.urls import include, path
from rest_framework_nested import routers

from .views import ApplicantViewSet, CalendarViewSet, EventViewSet

router = routers.DefaultRouter()
router.register(r"calendars", CalendarViewSet, basename="calendars")

events_router = routers.NestedSimpleRouter(router, "calendars", lookup="calendar")
events_router.register(r"events", EventViewSet, basename="events")

applicant_router = routers.NestedSimpleRouter(events_router, "events", lookup="event")
applicant_router.register(r"applicants", ApplicantViewSet, basename="applicants")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(events_router.urls)),
    path("", include(applicant_router.urls)),
    path("admin/", include("calendars.admin.urls")),
]
