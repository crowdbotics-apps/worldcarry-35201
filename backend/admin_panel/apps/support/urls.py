from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.support.views import FeedbackViewSet, SupportRequestViewSet, FAQViewSet, DashboardView

router = DefaultRouter()
router.register("feedback", FeedbackViewSet, basename="feedback")
router.register("support", SupportRequestViewSet, basename="support-request")
router.register("faq", FAQViewSet, basename="faq-request")


urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]