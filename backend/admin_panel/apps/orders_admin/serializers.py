from rest_framework import serializers
from orders.serializers import OrderSerializer
from orders.models import Order
from home.constants import ORDER_STATUS


class OrderListSerializer(serializers.Serializer):
    per_page = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    orders = OrderSerializer(many=True)

    class Meta:
        fields = ["per_page", "total_orders",  "orders"]


class CancelOrderSerializer(serializers.Serializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)
    status = serializers.ChoiceField(choices=ORDER_STATUS, required=True)
