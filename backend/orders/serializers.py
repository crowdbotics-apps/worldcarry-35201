from decimal import Decimal
from rest_framework import serializers
from django.core.files import File
from .models import Order, OrderImages
from users.serializers import UserProfileSerializer

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
    user = UserProfileSerializer(
        required=False
    )


    class Meta:
        model = Order
        fields = '__all__'

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

        data = str(order.id)
        
        import qrcode
        import os
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        filename = 'qrcode-%s.png' % str(order.id)[:10]

        img = qr.make_image()

        from django.conf import settings
        img.save(settings.MEDIA_ROOT + filename)
        with open(settings.MEDIA_ROOT + filename, "rb") as reopen:
            django_file = File(reopen)
            order.qr_code.save(filename, django_file, save=False)
        path = settings.MEDIA_ROOT + filename
        os.remove(path)
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
