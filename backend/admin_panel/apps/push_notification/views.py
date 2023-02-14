from admin_panel.apps.push_notification.services import create_notification
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from admin_panel.apps.push_notification.models import Notification
from admin_panel.apps.push_notification.serializers import ContentTypeSerializer, NotificationSerializer
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.contenttypes import models as generic_models

from users.models import User



class NotificationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.filter().order_by("-created_at")
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['user', 'is_read']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


    @action(detail=False, methods=['GET'])
    def read_notification(self, request):
        Notification.objects.filter(
            id=request.GET.get("id")
        ).update(is_read=True)
        return Response({"message": "Notification status updated"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'])
    def bulk_notification(self, request):
        users = User.objects.filter(is_active=True, is_superuser=False)
        for user in users:
            create_notification(
                {
                    "name": request.data.get("name"), 
                    "description": request.data.get("description"),
                    "is_send_now": request.data.get("is_send_now"),
                    "send_date": request.data.get("send_date"),
                    "user": user
                }
            )
        return Response({"message": "Notification status updated"}, status=status.HTTP_201_CREATED)

class GetAllContenttypes(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serialzier = ContentTypeSerializer(
            generic_models.ContentType.objects.all(),
            many=True
        )

        return Response(serialzier.data)

class GetObjects(APIView):

    def get(self, request):
        model = self.request.query_params.get("model", None)
        if model:
            model_class = generic_models.ContentType.objects.get(model=model).model_class()
            model_objects = model_class.objects.all().values('id')
            return Response(model_objects)
        else:
            return Response()

