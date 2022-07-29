from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.feedback.views import FeedbackViewSet

router = DefaultRouter()
router.register("feedback", FeedbackViewSet, basename="signup")


urlpatterns = [
    path("", include(router.urls)),
]
