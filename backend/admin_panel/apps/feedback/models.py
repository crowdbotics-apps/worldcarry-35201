from django.db import models
import uuid

from django.contrib.auth import get_user_model

User = get_user_model()


class Feedback(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False)
    email = models.EmailField(max_length=255)
    message = models.TextField()
    is_visible = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedbacks"
