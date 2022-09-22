from datetime import datetime
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from orders.models import Order
from orders.serializers import OrderSerializer
from payments.models import Payment
from payments.serializers import PaymentSerializer
from users.authentication import ExpiringTokenAuthentication
from decimal import Decimal
import stripe
import djstripe
from worldcarry_35201.settings import STRIPE_LIVE_MODE, STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


class PaymentViewSet(ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Payment.objects.all()

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def process(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method')
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Invalid Order ID'}, status=status.HTTP_400_BAD_REQUEST)
        amount = int(Decimal(order.total) * 100)
        if order.status != 'Unpaid':
            return Response({'detail': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
        customers_data = stripe.Customer.list().data
        customer = None
        for customer_data in customers_data:
            if customer_data.email == request.user.email:
                customer = customer_data
                break
        if customer is None:
            customer = stripe.Customer.create(email=request.user.email)
        djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
        payment_method = stripe.PaymentMethod.attach(payment_method, customer=customer)
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        request.user.account = djstripe_customer
        request.user.save()
        try:
            payment_intent = stripe.PaymentIntent.create(
                customer=customer.id, 
                payment_method=payment_method,  
                currency='usd',
                amount=amount,
                confirm=True)
        except:
            return Response({'detail': 'Card Declined'}, status=status.HTTP_400_BAD_REQUEST)
        djstripe_payment_intent = djstripe.models.PaymentIntent.sync_from_stripe_data(payment_intent)
        Payment.objects.create(
            order=order,
            user=request.user,
            amount=order.total,
            payment_intent=djstripe_payment_intent
        )
        order.status = 'Requested'
        order.save()
        return Response({'payment_intent': payment_intent, 'customer': customer})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def test_payment_method(self, request):
        payment_method = stripe.PaymentMethod.create(
        type="card",
        card={
            "number": "4242424242424242",
            "exp_month": 2,
            "exp_year": 2023,
            "cvc": "314",
        },
        )
        return Response(payment_method)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_cards(self, request):
        profile = request.user
        if profile.account:
            customer_id = profile.account.id
        else:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.account = djstripe_customer
            profile.save()
            customer_id = djstripe_customer.id
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def revoke_payment_method(self, request):
        payment_method_id = request.data.get('payment_method', None)
        if payment_method_id is None:
            return Response({'detail': 'Missing Payment Method ID'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user
        if profile.account:
            customer_id = profile.account.id
        else:
            customer_id = None
        if not customer_id:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.account = djstripe_customer
            profile.save()
            customer_id = djstripe_customer.id
        payment_method = stripe.PaymentMethod.detach(payment_method_id)
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_payment_method(self, request):
        profile = request.user
        if profile.account:
            customer_id = profile.account.id
        else:
            customer_id = None
        if not customer_id:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.account = djstripe_customer
            profile.save()
            customer_id = djstripe_customer.id
        payment_method_id = request.data.get('payment_method', None)
        if payment_method_id is None:
            return Response({'detail': 'Missing Payment Method ID'}, status=status.HTTP_400_BAD_REQUEST)
        payment_method = stripe.PaymentMethod.attach(payment_method_id, customer=customer_id)
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)
