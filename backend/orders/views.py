from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import OrderSerializer

from .models import Order
from users.authentication import ExpiringTokenAuthentication


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Order.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'status', 'created_at', 'carrier',
        'product_type', 'pickup_address_country', 'arrival_address_country']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
