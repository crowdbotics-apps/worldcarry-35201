from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from home.filters import JourneyFilter
from .serializers import JourneySerializer

from .models import Journey
from users.authentication import ExpiringTokenAuthentication


class JourneyViewSet(ModelViewSet):
    serializer_class = JourneySerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Journey.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = JourneyFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
