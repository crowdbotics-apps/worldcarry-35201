from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.push_notification.views import NotificationViewSet

from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet

router = DefaultRouter()
router.register("notification", NotificationViewSet, basename="notification")
router.register('device', FCMDeviceAuthorizedViewSet),


urlpatterns = [
    path("", include(router.urls)),
]