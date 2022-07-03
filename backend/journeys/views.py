from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
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

    @action(detail=False, methods=['get'])
    def onroute(self, request):
        today = timezone.now()
        orders = request.user.orders.filter(
            Q(status='Unpaid') | Q(status='Requested')
        ).values('pickup_address_country', 'arrival_address_country', 'deliver_before_date')

        journeys_list = Journey.objects.none()
        for order in orders:
            journeys = Journey.objects.filter(
                Q(
                    Q(date_of_journey__lt=order['deliver_before_date']) &
                    Q(date_of_journey__gt=today)\
                ) &
                (
                    Q(type="Round Trip") &
                    (
                        Q(departure_country=order['pickup_address_country']) &
                        Q(arrival_country=order['arrival_address_country'])
                    ) |
                    (
                        Q(departure_country=order['arrival_address_country']) &
                        Q(arrival_country=order['pickup_address_country'])
                    )
                ) |
                (
                    Q(type="One Way") &
                    Q(departure_country=order['pickup_address_country']) &
                    Q(arrival_country=order['arrival_address_country'])
                )
            )
            journeys_list = journeys_list | journeys
        serializer = JourneySerializer(journeys_list, many=True)
        return Response(serializer.data)
