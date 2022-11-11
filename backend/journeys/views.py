from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from home.filters import JourneyFilter
from home.constants import JourneyStatus
from orders.models import Order
from .serializers import JourneySerializer, JourneyOrderSerializer, MyJourneySerilaizer, DeclineJourneyOrderSerializer
from rest_framework.views import APIView

from .models import Journey, JourneyOrder, DeclineJourneyOrder
from .utils import get_on_rout_journeys
from users.authentication import ExpiringTokenAuthentication
from admin_panel.apps.push_notification.services import create_notification

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
        ordering = request.query_params.get('ordering', '-created_at')

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"detail": "Invalid Journey ID"}, status=status.HTTP_400_BAD_REQUEST)
        journeys = self.filter_queryset(get_on_rout_journeys(order))
        journeys = journeys.exclude(id__in=list(JourneyOrder.objects.filter(
            order=order, allowed_by_sender=True).values_list('journey_id', flat=True))).order_by(ordering)
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

        jo_instance, _ = JourneyOrder.objects.update_or_create(order=order, journey=journey)
        if user == 'sender':
            create_notification({"name": "Order Request", "description": "A Shipper requested you an an order",
                                 "user": journey.user})
            jo_instance.allowed_by_sender = True
            jo_instance.save(update_fields=['allowed_by_sender'])
            order.status = "Requested"
            order.save(update_fields=['status'])
        elif user == 'carrier':
            create_notification({"name": "Order Request", "description": "A Carrier requested you for journey",
                                 "user": order.user})
            jo_instance.allowed_by_carrier = True
            jo_instance.save(update_fields=['allowed_by_carrier'])

        # in case sender and carrier
        if jo_instance.allowed_by_sender and jo_instance.allowed_by_carrier:
            # TODO add notification here
            order.status = "Accepted"
            order.carrier = jo_instance.journey.user
            order.save(update_fields=['status', 'carrier'])

        return Response({"message": "Request Added for order: {}".format(order.id)}, status=status.HTTP_200_OK)


class MyJourneyView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        current_date = timezone.now().date()
        journeys = Journey.objects.filter(user=request.user)

        data = {
            'completed': journeys.filter(date_of_journey__lt=current_date),
            'ongoing': journeys.filter(date_of_journey=current_date),
            'upcoming': journeys.filter(date_of_journey__gt=current_date)
        }

        serializer = MyJourneySerilaizer(data)
        return Response(serializer.data)


class RejectOfferView(CreateAPIView):
    serializer_class = DeclineJourneyOrderSerializer
    permission_classes = (IsAuthenticated,)
    queryset = DeclineJourneyOrder.objects.all()
