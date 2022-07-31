from rest_framework import serializers
from orders.serializers import OrderSerializer


class OrderListSerializer(serializers.Serializer):
    per_page = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    orders = OrderSerializer(many=True)

    class Meta:
        fields = ["per_page", "total_orders",  "orders"]
