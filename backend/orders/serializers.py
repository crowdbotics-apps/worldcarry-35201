from decimal import Decimal
from rest_framework import serializers
from .models import Order, OrderImages

from datetime import timedelta


class OrderImagesSerializer(serializers.ModelSerializer):
    """
    A custom serializer for the multiple images of a single Order
    """
    class Meta:
        model = OrderImages
        fields = '__all__'
        extra_kwargs = {'order': {'required': False}}


class OrderSerializer(serializers.ModelSerializer):
    """
    A custom serializer for representing all data related
    to the Orders including their multiple optional images
    """
    images = OrderImagesSerializer(
            many=True,
            required=False
        )


    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}

    def create(self, validated_data):
        images_data = validated_data.pop('images', None)
        order = super().create(validated_data)
        if images_data:
            for image_data in images_data:
                OrderImages.objects.create(
                    order=order,
                    **image_data
                )
        if "expected_wait_time" in validated_data:
            if validated_data["expected_wait_time"] == "Up to 2 weeks":
                order.deliver_before_date = (order.created_at + timedelta(weeks=2)).date()
            elif validated_data["expected_wait_time"] == "Up to 3 weeks":
                order.deliver_before_date = (order.created_at + timedelta(weeks=3)).date()
            elif validated_data["expected_wait_time"] == "Up to 1 month":
                order.deliver_before_date = (order.created_at + timedelta(weeks=4)).date()
            elif validated_data["expected_wait_time"] == "Up to 2 months":
                order.deliver_before_date = (order.created_at + timedelta(weeks=8)).date()
            elif validated_data["expected_wait_time"] == "Up to 3 months":
                order.deliver_before_date = (order.created_at + timedelta(weeks=12)).date()
        order.subtotal = order.product_price + order.carrier_reward
        order.total = order.subtotal + Decimal(7.99) + Decimal(3.99)
        order.save()
        return order

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        order = super().update(instance, validated_data)
        if images_data:
            for image_data in images_data:
                OrderImages.objects.create(
                    order=order,
                    **image_data
                )
        if "expected_wait_time" in validated_data:
            if validated_data["expected_wait_time"] == "Up to 2 weeks":
                order.deliver_before_date = (order.created_at + timedelta(weeks=2)).date()
            elif validated_data["expected_wait_time"] == "Up to 3 weeks":
                order.deliver_before_date = (order.created_at + timedelta(weeks=3)).date()
            elif validated_data["expected_wait_time"] == "Up to 1 month":
                order.deliver_before_date = (order.created_at + timedelta(weeks=4)).date()
            elif validated_data["expected_wait_time"] == "Up to 2 months":
                order.deliver_before_date = (order.created_at + timedelta(weeks=8)).date()
            elif validated_data["expected_wait_time"] == "Up to 3 months":
                order.deliver_before_date = (order.created_at + timedelta(weeks=12)).date()
        order.subtotal = order.product_price + order.carrier_reward
        order.total = order.subtotal + Decimal(7.99) + Decimal(3.99)
        order.save()
        return order