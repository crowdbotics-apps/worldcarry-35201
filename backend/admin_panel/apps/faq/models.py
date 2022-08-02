from django.db import models
import uuid

from django.contrib.auth import get_user_model

User = get_user_model()


class FAQ(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    question = models.CharField(max_length=250)
    answer = models.TextField()
    is_visible = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"