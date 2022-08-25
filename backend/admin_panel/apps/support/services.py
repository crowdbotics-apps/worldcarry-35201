import base64
from django.core.files.base import ContentFile
from admin_panel.apps.support.models import Feedback, FeedbackMedia, SupportRequest, SupportRequestMedia


def convert_file_from_bse64_to_blob(file, file_name):
    data = ContentFile(base64.b64decode(file), name='{}.jpg'.format(file_name))
    return data


def create_feedback(validated_data):
    feedback = Feedback.objects.create(
        email=validated_data['email'],
        message=validated_data['message'],
    )
    for key, val in validated_data['files'].items():
        FeedbackMedia.objects.create(feedback=feedback, file=convert_file_from_bse64_to_blob(val, key))
    return feedback


def create_support_request(validated_data):
    support_request = SupportRequest.objects.create(
        name=validated_data['name'],
        email=validated_data['email'],
        message=validated_data['message'],
    )
    for key, val in validated_data['files'].items():
        SupportRequestMedia.objects.create(support_request=support_request,
                                           file=convert_file_from_bse64_to_blob(val, key))
    return support_request
