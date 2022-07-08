from django.contrib.gis.db import models
from django.contrib.auth import get_user_model

from home.models import UUIDModel


User = get_user_model()


class Location(UUIDModel):
    """
    A data representation of the historical locations used by a User
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='locations'
    )
    coordinates = models.PointField(
        blank=True, 
        null=True
    )
    street_one = models.CharField(
        max_length=255,
        blank=True
    )
    street_two = models.CharField(
        max_length=255,
        blank=True
    )
    city = models.CharField(
        max_length=255,
        blank=True
    )
    state = models.CharField(
        max_length=255,
        blank=True
    )
    postal_code = models.CharField(
        max_length=16,
        blank=True
    )
    country = models.CharField(
        max_length=255,
        blank=True
    )