from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.support.views import FeedbackViewSet, SupportRequestViewSet

router = DefaultRouter()
router.register("feedback", FeedbackViewSet, basename="feedback")
router.register("support", SupportRequestViewSet, basename="support-request")


urlpatterns = [
    path("", include(router.urls)),
]