from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from orders.models import Order
from .serializers import OrderListSerializer
from .filtersets import OrderListFilterSet
from django.core.paginator import Paginator, EmptyPage


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
