from django.db import models

from orders.models import Order
from home.models import UUIDModel
from djstripe.models import PaymentIntent
from users.models import User

class Payment(UUIDModel):
    """
    A model to represent the Order Payments
    """
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, related_name='payments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments')
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    payment_intent = models.ForeignKey(PaymentIntent, on_delete=models.SET_NULL, null=True)
