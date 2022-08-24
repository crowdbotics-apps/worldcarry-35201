from decimal import Decimal
from rest_framework import serializers
from django.core.files import File

from payments.models import Payment
from .models import Order, OrderImages
from users.serializers import UserProfileSerializer
from home.constants import ORDER_STATUS

from datetime import timedelta

import stripe
import djstripe
from worldcarry_35201.settings import STRIPE_LIVE_MODE, STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


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
    carrier = UserProfileSerializer(
        required=False
    )
    can_transit = serializers.ReadOnlyField()
    journey = serializers.ReadOnlyField(allow_null=True, source='order_journey')
    payment_method_id = serializers.CharField(write_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        user =  self.context['request'].user
        images_data = validated_data.pop('images', None)
        payment_method = validated_data.pop('payment_method_id', None)
        order = super().create(validated_data)

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

        amount = int(Decimal(order.total) * 100)

        if user.account:
            customer_id = user.account.id
            customer = user.account
        else:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            customer_id = customer.id
            user.account = djstripe_customer
            user.save()

        payment_method = stripe.PaymentMethod.attach(payment_method, customer=customer)
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        try:
            payment_intent = stripe.PaymentIntent.create(
                customer=customer_id, 
                payment_method=payment_method,  
                currency='usd',
                amount=amount,
                confirm=True)
        except:
            order.delete()
            raise serializers.ValidationError('Card Declined')

        djstripe_payment_intent = djstripe.models.PaymentIntent.sync_from_stripe_data(payment_intent)
        Payment.objects.create(
            order=order,
            user=user,
            amount=order.total,
            payment_intent=djstripe_payment_intent
        )
        order.status = 'Requested'

        if images_data:
            for image_data in images_data:
                OrderImages.objects.create(
                    order=order,
                    **image_data
                )
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

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.pickup_address_coordinates:
            rep['pickup_coords'] = instance.pickup_address_coordinates.coords
        if instance.arrival_address_coordinates:
            rep['arrival_coords'] = instance.arrival_address_coordinates.coords
        return rep


class OrderRouteSerialzier(serializers.Serializer):
    offers = OrderSerializer(many=True)
    accepted = OrderSerializer(many=True)
    requested_by_sender = OrderSerializer(many=True)
    in_transit = OrderSerializer(many=True)
    delivered = OrderSerializer(many=True)
    offers_count = serializers.IntegerField()
    accepted_count = serializers.IntegerField()
    requested_by_sender_count = serializers.IntegerField()
    in_transit_count = serializers.IntegerField()
    delivered_count = serializers.IntegerField()


class ProductScraperSerializer(serializers.Serializer):
    url = serializers.URLField(required=True, allow_null=False, allow_blank=False)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        url = attrs['url']
        if 'amazon' not in url and 'ebay' not in url:
            raise serializers.ValidationError({"Only Amazon and Ebay Urls are accepted"})
        return attrs


class OrderQrSerializer(serializers.Serializer):
    qr_text = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)
    status = serializers.ChoiceField(choices=ORDER_STATUS, required=True)

    def validate(self, attrs: dict) -> None:
        data = super().validate(attrs)
        order = data['order']
        status = data['status']

        if status == order.status:
            raise serializers.ValidationError("Order is already marked {}".format(status).format(status))

        elif status == "Received":
            if order.status != "In transit":
                raise serializers.ValidationError("To mark order received order should be in transit".format(status))
        return attrs
