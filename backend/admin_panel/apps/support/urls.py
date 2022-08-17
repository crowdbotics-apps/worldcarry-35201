from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.support.views import FeedbackViewSet, SupportRequestViewSet, FAQViewSet

router = DefaultRouter()
router.register("feedback", FeedbackViewSet, basename="feedback")
router.register("support", SupportRequestViewSet, basename="support-request")
router.register("faq", FAQViewSet, basename="faq-request")


urlpatterns = [
    path("", include(router.urls)),
]