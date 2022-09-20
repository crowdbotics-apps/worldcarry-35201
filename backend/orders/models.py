from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from home.constants import ORDER_STATUS, PRODUCT_TYPES, WAIT_TIMES
from orders.status_enums import ORDER_ACTIVITY_LOG_TYPES
from home.models import UUIDModel


User = get_user_model()


class Order(UUIDModel):
    """
    A data representation of the Product ordered by a User
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders'
    )
    carrier = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carrier_orders'
    )
    product_name = models.CharField(
        max_length=255,
        blank=True
    )
    product_type = models.CharField(
        choices=PRODUCT_TYPES,
        max_length=255,
        blank=True
    )
    product_link = models.CharField(
        max_length=512,
        blank=True
    )
    product_price = models.DecimalField(
        decimal_places=2,
        max_digits=8,
        default=0
    )
    carrier_reward = models.DecimalField(
        decimal_places=2,
        max_digits=8,
        default=0
    )
    expected_wait_time = models.CharField(
        choices=WAIT_TIMES,
        max_length=64,
        blank=True
    )
    description = models.TextField(
        blank=True
    )
    pickup_address_coordinates = models.PointField(
        blank=True, 
        null=True
    )
    pickup_address_street_one = models.CharField(
        max_length=255,
        blank=True
    )
    pickup_address_street_two = models.CharField(
        max_length=255,
        blank=True
    )
    pickup_address_city = models.CharField(
        max_length=255,
        blank=True
    )
    pickup_address_state = models.CharField(
        max_length=255,
        blank=True
    )
    pickup_address_postal_code = models.CharField(
        max_length=16,
        blank=True
    )
    pickup_address_country = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_coordinates = models.PointField(
        blank=True, 
        null=True
    )
    arrival_address_street_one = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_street_two = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_city = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_state = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_country = models.CharField(
        max_length=255,
        blank=True
    )
    arrival_address_postal_code = models.CharField(
        max_length=16,
        blank=True
    )
    subtotal = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0
    )
    total = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0
    )
    status = models.CharField(
        choices=ORDER_STATUS,
        max_length=64,
        default='Requested'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    deliver_before_date = models.DateField(
        blank=True,
        null=True
    )
    qr_code = models.ImageField(
        upload_to='orders/qr',
        blank=True,
        null=True
    )
    admin_paid = models.BooleanField(
        default=False
    )

    @property
    def can_transit(self):
        if self.journeyorder_set.filter(allowed_by_carrier=True, allowed_by_sender=True).exists():
            return True
        return False

    @property
    def order_journey(self):
        o_journey = self.journeyorder_set.filter(allowed_by_carrier=True, allowed_by_sender=True)
        if o_journey.exists():
            return o_journey.first().journey_id
        return None


class OrderImages(UUIDModel):
    """
    A data representation of the multiple Order Images attached
    to an Order
    """
    order = models.ForeignKey( 
        Order,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to='orders/images'
    )


class OrderActivityLog(UUIDModel):
    """
    A data representation of the Order Activity Logs attached
    to an Order
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='activity_log')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    message = models.CharField(max_length=255)
    action_type = models.IntegerField(choices=ORDER_ACTIVITY_LOG_TYPES)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        self.order.product_name

    class Meta:
        db_table = 'orders_order_activity_log'
