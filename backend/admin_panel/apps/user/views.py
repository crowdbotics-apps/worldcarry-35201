from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from home.api.v1.serializers import UserSerializer
from home.permissions import IsAdmin

from django.contrib.auth import get_user_model

User = get_user_model()


class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()
