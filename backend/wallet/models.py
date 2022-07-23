from django.db import models
from wallet.status_enums import *
from users.models import User
from orders.models import Order
from home.models import UUIDModel


class UserTransaction(UUIDModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='user_transaction')
    amount = models.FloatField()
    amount_before_transaction = models.FloatField()
    amount_after_transaction = models.FloatField()
    trans_type = models.CharField(choices=TRANSACTION_TYPES, max_length=1, db_index=True)
    payment_type = models.CharField(choices=PAYMENT_OPTIONS, db_index=True, max_length=2)
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='order_transaction', null=True)
    details = models.CharField(max_length=256, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "user_transaction"
