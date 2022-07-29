from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from admin_panel.apps.feedback.models import Feedback
from admin_panel.apps.feedback.serializers import FeedbackSerializer
from home.api.v1.serializers import UserSerializer
from home.permissions import IsAdmin
from rest_framework.generics import CreateAPIView


from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.filter()