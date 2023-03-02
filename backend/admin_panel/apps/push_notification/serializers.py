from admin_panel.apps.push_notification.models import *
from admin_panel.apps.push_notification.utils import send_notification

from rest_framework import serializers

from home.api.v1.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    user_detail = serializers.SerializerMethodField("get_user_detail", read_only=True)

    class Meta:
        model = Notification
        exclude = [

        ]

    def get_user_detail(self, obj):
        return UserSerializer(obj.user).data

    def create(self, validated_data):
        request = self.context["request"]
        for user in request.data.get('users'):
            notification = Notification.objects.create(
                user=User.objects.get(id=user),
                name=request.data.get('name'),
                description=request.data.get('description'),
                is_send_now=request.data.get('is_send_now'),
                send_date=request.data.get('send_date'),
            )
            send_notification(
                user=notification.user,
                message=notification.description,
                title=notification.name
            )
        return notification 


class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = generic_models.ContentType
        fields = ['id','model']