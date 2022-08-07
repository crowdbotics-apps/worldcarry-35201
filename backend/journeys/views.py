from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from home.filters import JourneyFilter
from home.constants import JourneyStatus
from orders.models import Order
from .serializers import JourneySerializer, JourneyOrderSerializer
from rest_framework.views import APIView

from .models import Journey, JourneyOrder
from users.authentication import ExpiringTokenAuthentication

from rest_framework.filters import OrderingFilter


class JourneyViewSet(ModelViewSet):
    serializer_class = JourneySerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Journey.objects.all()
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = JourneyFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def onroute(self, request):
        order_id = request.query_params.get('order_id')
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"detail": "Invalid Journey ID"}, status=status.HTTP_400_BAD_REQUEST)
        today = timezone.now()

        journeys = Journey.objects.filter(
            Q(
                Q(date_of_journey__lt=order.deliver_before_date) &
                Q(date_of_journey__gt=today)
            ) &
            (
                Q(type="Round Trip") &
                (
                    Q(departure_country=order.pickup_address_country) &
                    Q(arrival_country=order.arrival_address_country)
                ) |
                (
                    Q(departure_country=order.arrival_address_country) &
                    Q(arrival_country=order.pickup_address_country)
                )
            ) |
            (
                Q(type="One Way") &
                Q(departure_country=order.pickup_address_country) &
                Q(arrival_country=order.arrival_address_country)
            )
        )
        journeys = self.filter_queryset(journeys)
        serializer = JourneySerializer(journeys, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        #  TODO need to fix when ongoing status will be added from cronjob
        if request.query_params.get('status', '') == JourneyStatus.ongoing.value:
            queryset = self.get_queryset().filter(user=request.user, date_of_journey=timezone.now().date())
        else:
            queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class JourneyOrderRequest(APIView):
    serializer_class = JourneyOrderSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        order = data['order']
        journey = data['journey']
        user = data['user']
        if user == 'sender':
            JourneyOrder.objects.update_or_create(order=order, journey=journey, defaults={'allowed_by_sender': True})
            order.status = "Requested"
            order.save()
        elif user == 'carrier':
            JourneyOrder.objects.update_or_create(order=order, journey=journey, defaults={'allowed_by_carrier': True})
        return Response({"message": "Request Added for order: {}".format(order.id)}, status=status.HTTP_200_OK)
