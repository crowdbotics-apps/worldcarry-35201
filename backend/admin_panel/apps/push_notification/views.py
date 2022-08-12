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


# class RegisterDevice(CreateAPIView):
#     permission_classes = ""
#     serializer_class = SupportRequestSerializer
#     queryset = SupportRequest.objects.filter()
#
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)