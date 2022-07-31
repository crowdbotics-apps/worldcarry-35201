from django_filters import rest_framework as filters
from orders.models import Order


class OrderListFilterSet(filters.FilterSet):
    product_name = filters.CharFilter(field_name='product_name', lookup_expr='contains')

    class Meta:
        model = Order
        fields = ('user', 'carrier', 'status', 'product_type', 'product_price', 'carrier_reward', 'product_name')
