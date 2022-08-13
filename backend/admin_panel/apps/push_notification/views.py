from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from admin_panel.apps.push_notification.models import Notification
from home.permissions import IsAdmin
from rest_framework.generics import CreateAPIView, ListAPIView
from admin_panel.apps.push_notification.serializers import NotificationSerializer

from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet, FCMDeviceViewSet
from fcm_django.api.rest_framework import Serializer

class NotificationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.filter()