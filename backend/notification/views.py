from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import ExpiringTokenAuthentication
from notification.serializers import NotificationSerializer, NotificationUpdateSerializer
from notification.models import Notification
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Notification.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).order_by('read', '-updated_at')


class ReadNotificationView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]

    def put(self, request, *args, **kwargs):
        serializer = NotificationUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data['notifications']
        Notification.objects.filter(id__in=[item.id for item in ids]).update(read=True)
        return Response(status=status.HTTP_200_OK)
