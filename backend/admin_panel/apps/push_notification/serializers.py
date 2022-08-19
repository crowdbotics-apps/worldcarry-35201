from admin_panel.apps.push_notification.models import *

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
