from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from locations.models import Location
from locations.serializers import LocationSerializer

from users.authentication import ExpiringTokenAuthentication


class LocationViewSet(ModelViewSet):
    serializer_class = LocationSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Location.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
