from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage

from orders.models import Order, OrderActivityLog
from .serializers import OrderListSerializer, CancelOrderSerializer
from .filtersets import OrderListFilterSet
from orders.status_enums import OrderActivityLogTypes


class OrderListViewSet(ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    filterset_class = OrderListFilterSet
    permission_classes = [IsAuthenticated]
    PAGE_SIZE = 10

    def list(self, request, *args, **kwargs):
        orders = self.filter_queryset(self.get_queryset())
        paginator = Paginator(orders, self.PAGE_SIZE)
        try:
            return Response(OrderListSerializer({
                "per_page": self.PAGE_SIZE,
                "total_orders": paginator.count,
                "orders": paginator.page(request.GET.get('page', 1))
            }).data)
        except EmptyPage:
            return Response('No orders available', status=400)


class CancelOrderView(APIView):
    serializer_class = CancelOrderSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.validated_data.get('order')
        order_status = serializer.validated_data.get('status')
        order.status = order_status
        order.save(update_fields=['status'])
        OrderActivityLog.objects.create(order=order, user=user,
                                        action_type=OrderActivityLogTypes.cancel.value,
                                        message="Order has been cancelled")

        return Response({"message": "Order has been Cancelled"}, status=status.HTTP_200_OK)
