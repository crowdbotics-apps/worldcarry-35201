from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

from home.constants import JOURNEY_TYPE, PRODUCT_TYPES
from home.models import UUIDModel


User = get_user_model()


class  Journey(UUIDModel):
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
