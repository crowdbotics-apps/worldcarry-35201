from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

from home.constants import (JOURNEY_TYPE, PRODUCT_TYPES, JOURNEY_STATUS, JOURNEY_REQUEST_STATUS, JourneyStatus,
                            JourneyRequestStatus)
from home.models import UUIDModel
from orders.models import Order


User = get_user_model()


class Journey(UUIDModel):
    """
    A data representation for the Travel plans of a Carrier
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='journeys'
    )
    type = models.CharField(
        choices=JOURNEY_TYPE,
        max_length=64
    )
    departure_city = models.CharField(
        max_length=255
    )
    departure_state = models.CharField(
        max_length=255
    )
    departure_country = models.CharField(
        max_length=255
    )
    arrival_city = models.CharField(
        max_length=255
    )
    arrival_state = models.CharField(
        max_length=255
    )
    arrival_country = models.CharField(
        max_length=255
    )
    date_of_journey = models.DateField()
    date_of_return = models.DateField(
        blank=True,
        null=True
    )
    willing_to_carry = ArrayField(
        models.CharField(
            choices=PRODUCT_TYPES,
            max_length=64,
        ),
        null=True,
        blank=True
    )
    total_weight = models.IntegerField(
        default=0 
    )

    status = models.CharField(
        choices=JOURNEY_STATUS,
        default=JourneyStatus.upcoming.value,
        max_length=65,
        null=True)


class JourneyOrder(UUIDModel):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    allowed_by_carrier = models.BooleanField(default=False)
    allowed_by_sender = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        unique_together = (('journey', 'order'), )
        db_table = 'journey_order'


class DeclineJourneyOrder(UUIDModel):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=False)

    class Meta:
        db_table = 'decline_journey_order'
