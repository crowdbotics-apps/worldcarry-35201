from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import OrderSerializer, ProductScraperSerializer, OrderQrSerializer

from journeys.models import Journey
from .models import Order
from users.authentication import ExpiringTokenAuthentication
from modules.scraper import get_product_details


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Order.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'status', 'created_at', 'carrier',
        'product_type', 'pickup_address_country', 'arrival_address_country']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def onroute(self, request):
        journey_id = request.query_params.get('journey_id')
        try:
            journey = Journey.objects.get(id=journey_id)
        except Journey.DoesNotExist:
            return Response({"detail": "Invalid Journey ID"}, status=status.HTTP_400_BAD_REQUEST)
        today = timezone.now()

        if journey.date_of_journey < today.date():
            return Response({"detail": "This Journey has already passed its departure date"},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if journey.type == 'Round Trip':
            orders = Order.objects.filter(
                (Q(status='Unpaid') | Q(status='Requested')) &
                (
                    Q(pickup_address_country=journey.departure_country) &
                    Q(arrival_address_country=journey.arrival_country)
                ) |
                Q(
                    Q(pickup_address_country=journey.arrival_country) &
                    Q(arrival_address_country=journey.departure_country)
                )
            )
        else:
            orders = Order.objects.filter(
                Q(status='Unpaid') &
                (
                    Q(pickup_address_country=journey.departure_country) &
                    Q(arrival_address_country=journey.arrival_country)
                )
            )

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

        # journeys = request.user.journeys`.filter(
        #     date_of_journey__gt=today
        # ).values('departure_country', 'arrival_country', 'type')
        # orders_list = Order.objects.none()
        # single_orders = Order.objects.none()
        # round_orders = Order.objects.none()
        # for journey in journeys:
        #     if journey['type'] == 'Round Trip':
        #         round_orders = Order.objects.filter(
        #             (Q(status='Unpaid') | Q(status='Requested')) &
        #             (
        #                 Q(pickup_address_country=journey['departure_country']) &
        #                 Q(arrival_address_country=journey['arrival_country'])
        #             ) |
        #             Q(
        #                 Q(pickup_address_country=journey['arrival_country']) &
        #                 Q(arrival_address_country=journey['departure_country'])
        #             )
        #         )
        #     else:
        #         single_orders = Order.objects.filter(
        #             Q(status='Unpaid') &
        #             (
        #                 Q(pickup_address_country=journey['departure_country']) &
        #                 Q(arrival_address_country=journey['arrival_country'])
        #             )
        #         )
        #     orders_list = orders_list | round_orders | single_orders
        #     single_orders = Order.objects.none()
        #     round_orders = Order.objects.none()
        # serializer = OrderSerializer(orders_list, many=True)
        # return Response(serializer.data)


class GetProductDetailView(APIView):
    serializer_class = ProductScraperSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]

    def get(self, request):
        serializer = self.serializer_class(data=request.GET)
        serializer.is_valid(raise_exception=True)
        product_url = serializer.validated_data.get('url')
        data = get_product_details(url=product_url).get('data')
        return Response({"data": data})


class QRScanOrder(APIView):
    serializer_class = OrderQrSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]

    def post(self, request):
        carrier = request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.validated_data.get('qr_text')
        if order.user == carrier:
            return Response({"message": "Order owner can't be carrier"}, status=status.HTTP_400_BAD_REQUEST)
        order.carrier = carrier
        order.save(update_fields=['carrier'])
        return Response({"message": "Order has been successfully assigned"}, status=status.HTTP_400_BAD_REQUEST)
