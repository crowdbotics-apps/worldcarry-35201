from django.db import models
import uuid

from django.contrib.auth import get_user_model
from admin_panel.apps.support.enums import FAQCategoriesEnum

User = get_user_model()

class Feedback(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    email = models.EmailField(max_length=255)
    message = models.TextField()
    is_visible = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='media/feedback/')
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedbacks"


class FAQ(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    question = models.CharField(max_length=250)
    answer = models.TextField()
    categories = models.CharField(max_length=10, default=FAQCategoriesEnum.BASIC.value, choices=FAQCategoriesEnum.choices())
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"


class SupportRequest(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    email = models.EmailField(max_length=255)
    message = models.TextField()
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='media/support_request/')

    class Meta:
        verbose_name = "SupportRequest"
        verbose_name_plural = "SupportRequest"