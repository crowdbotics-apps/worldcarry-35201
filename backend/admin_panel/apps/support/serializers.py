from rest_framework import serializers

from admin_panel.apps.support.models import Feedback, FAQ, SupportRequest
from home.api.v1.serializers import UserSerializer


class FeedbackSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField("get_user", read_only=True)

    class Meta:
        model = Feedback
        fields = "__all__"

    @staticmethod
    def get_user(obj):
        return UserSerializer(obj.user).data


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        exclude = [
            'id', 'created_at'
        ]

class SupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        exclude = [
            'id', 'created_at'
        ]