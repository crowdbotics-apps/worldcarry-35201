from django.db import models
from home.models import UUIDModel
from django.contrib.auth import get_user_model


User = get_user_model()


class Notification(UUIDModel):

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='notification')
    title = models.CharField(max_length=256)
    message = models.CharField(max_length=512, null=True)
    sent = models.BooleanField(default=True)
    read = models.BooleanField(default=False)
    response = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification'
