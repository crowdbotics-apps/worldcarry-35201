from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
import uuid
from home.models import UUIDModel

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("Email of User"), max_length=255, unique=True)
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    activation_key = models.CharField(max_length=255, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class Profile(UUIDModel):
    """
    A user profile model that holds any fields irrelavant to authentcation
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
