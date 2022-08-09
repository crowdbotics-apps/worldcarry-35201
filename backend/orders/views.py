from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (OrderSerializer, ProductScraperSerializer, OrderQrSerializer, OrderRouteSerialzier,
                          UpdateOrderStatusSerializer)

from journeys.models import Journey, JourneyOrder
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
        ordering = request.query_params.get('ordering', '-created_at')
        try:
            journey = Journey.objects.get(id=journey_id)
        except Journey.DoesNotExist:
            return Response({"detail": "Invalid Journey ID"}, status=status.HTTP_400_BAD_REQUEST)
        today = timezone.now()

        if journey.date_of_journey < today.date():
            return Response({"detail": "This Journey has already passed its departure date"},
                            status=status.HTTP_400_BAD_REQUEST)

        order_statuses = ['Unpaid', 'Requested', "Accepted"]
        
        if journey.type == 'Round Trip':
            orders = Order.objects.filter((Q(status__in=order_statuses) &
                                           (Q(pickup_address_country=journey.departure_country) &
                                            Q(arrival_address_country=journey.arrival_country))
                                           |
                                           Q(Q(pickup_address_country=journey.arrival_country) &
                                             Q(arrival_address_country=journey.departure_country))))
        else:
            orders = Order.objects.filter(status__in=order_statuses,
                                          pickup_address_country=journey.departure_country,
                                          arrival_address_country=journey.arrival_country)

        orders = orders.order_by(ordering)
        # accepted:
        accepted_orders = orders.filter(journeyorder__allowed_by_carrier=True, journeyorder__allowed_by_sender=False,
                                        journeyorder__journey=journey)
        orders = orders.exclude(id__in=accepted_orders.values_list('id'))

        # request by sender
        request_by_sender = orders.filter(journeyorder__allowed_by_sender=True,
                                          journeyorder__journey=journey)
        orders = orders.exclude(id__in=request_by_sender.values_list('id'))

        # In transit
        transit_orders = Order.objects.filter(journeyorder__allowed_by_carrier=True,
                                              journeyorder__allowed_by_sender=True, journeyorder__journey=journey,
                                              status="In transit")

        # delivered
        delivered_orders = Order.objects.filter(journeyorder__allowed_by_carrier=True,
                                                journeyorder__allowed_by_sender=True, journeyorder__journey=journey,
                                                status="Received")

        data = {'offers': orders, 'offers_count': orders.count(),
                'accepted': accepted_orders, 'accepted_count': accepted_orders.count(),
                'in_transit': transit_orders, 'in_transit_count': transit_orders.count(),
                'delivered': delivered_orders, 'delivered_count': delivered_orders.count(),
                'requested_by_sender': request_by_sender, 'requested_by_sender_count': request_by_sender.count() }

        serializer = OrderRouteSerialzier(data)
        return Response(serializer.data)


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
        return Response({"message": "Order has been successfully assigned"}, status=status.HTTP_200_OK)


class UpdateOrderStatus(APIView):
    serializer_class = UpdateOrderStatusSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]

    def put(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.validated_data.get('order')
        new_status = serializer.validated_data.get('status')

        if new_status == "In transit":
            if JourneyOrder.objects.filter(order=order, allowed_by_carrier=True, allowed_by_sender=True).exists():
                order.status = new_status
                order.save()
                #  TODO notification send to the order owner
                return Response({"message": "Order has been moved to transit"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Order not approved by the Sender"}, status=status.HTTP_400_BAD_REQUEST)
        elif new_status == "Received":
            order.status = new_status
            order.save()
            #  TODO notification send to the order owner
            return Response({"message": "Order has been received"}, status=status.HTTP_200_OK)
