from rest_framework import serializers
import itertools
from admin_panel.apps.support.models import Feedback, FAQ, SupportRequest, FeedbackMedia, SupportRequestMedia
from home.api.v1.serializers import UserSerializer
from admin_panel.apps.support.services import create_feedback,create_support_request


class FeedbackSerializer(serializers.ModelSerializer):
    files = serializers.DictField(child=serializers.CharField(allow_null=True), write_only=True, required=False)
    user_details = serializers.SerializerMethodField("get_user", read_only=True)
    feedback_media = serializers.SerializerMethodField("get_feedback_media", read_only=True)

    class Meta:
        model = Feedback
        fields = (
            "id", "name", "email", "message", "reply", "is_visible",
            "is_active", "user", "user_details", "files",
            "feedback_media"
        )

    @staticmethod
    def get_user(obj):
        return UserSerializer(obj.user).data

    @staticmethod
    def get_feedback_media(obj):
        return FeedbackMediaSerializer(
            FeedbackMedia.objects.filter(feedback=obj),
            many=True
        ).data

    def create(self, validated_data):
        feedback = create_feedback(validated_data)
        return feedback


class FeedbackMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMedia
        fields = ('id', 'file')


class FaqSerializer(serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    QAlist = serializers.ListField(read_only=True)
    class Meta:
        model = FAQ
        fields = ('title','QAlist')

    def to_representation(self, instance):
        data = super(FaqSerializer, self).to_representation(instance)
        data['title'] = instance.categories
        data['QAlist'] = FAQ.objects.filter(categories=instance.categories).values('question','answer')
        return data


class SupportRequestMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMedia
        fields = ('id', 'file')


class SupportRequestSerializer(serializers.ModelSerializer):
    files = serializers.DictField(child=serializers.CharField(allow_null=True), write_only=True, required=False)
    support_request_media = serializers.SerializerMethodField("get_support_request_media", read_only=True)

    class Meta:
        model = SupportRequest
        exclude = [
            'id', 'created_at',
        ]

    @staticmethod
    def get_support_request_media(obj):
        return SupportRequestMediaSerializer(
            SupportRequestMedia.objects.filter(support_request=obj),
            many=True
        ).data

    def create(self, validated_data):
        support_request = create_support_request(validated_data)
        return support_request
