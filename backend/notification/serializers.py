from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    A data serialization of the notification history of a User
    """
    class Meta:
        model = Notification
        fields = '__all__'


class NotificationUpdateSerializer(serializers.Serializer):
    notifications = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=Notification.objects.all()),
                                          required=True)
