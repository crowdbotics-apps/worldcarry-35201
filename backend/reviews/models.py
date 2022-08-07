from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from home.models import UUIDModel
from orders.models import Order
from journeys.models import Journey

User = get_user_model()


class Review(UUIDModel):
    """
    A data representation of the Review by a User
    """
    target_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='review')
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewer')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_review')
    journey = models.ForeignKey(Journey, on_delete=models.SET_NULL, null=True, blank=True, related_name='journey_review')
    rating = models.FloatField(null=True)
    content = models.TextField(max_length=1000, null=True)
    respectful_attitude = models.BooleanField(null=True)
    no_additional_payment_asked = models.BooleanField(null=True)
    d2d_delivery = models.BooleanField(null=True)

    class Meta:
        db_table = 'reviews_review'

    def __str__(self):
        return self.order.product_name
