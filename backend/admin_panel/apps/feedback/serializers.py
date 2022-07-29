from rest_framework import serializers

from admin_panel.apps.feedback.models import Feedback
from home.api.v1.serializers import UserSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField("get_user", read_only=True)

    class Meta:
        model = Feedback
        fields = "__all__"


    def get_user(self, obj):
        return UserSerializer(obj.user).data

