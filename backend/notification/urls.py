from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet
from django.urls import path, include
from notification.views import NotificationViewSet, ReadNotificationView

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('register/device', FCMDeviceAuthorizedViewSet)
router.register('', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('read', ReadNotificationView.as_view() )
              ] + router.urls
