from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
import uuid
from phonenumber_field.modelfields import PhoneNumberField

from home.models import UUIDModel

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,14}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed.")

class User(AbstractUser):
    # Validators
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("Email of User"), max_length=255, unique=True)
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
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
    photo = models.ImageField(
        upload_to='user/profile',
        blank=True,
        null=True
    )
    is_phone_verified = models.BooleanField(
        default=False
    )
    is_email_verified = models.BooleanField(
        default=False
    )
    verified_phone = PhoneNumberField(blank=True, null=True)
    verified_email = models.EmailField(max_length=255, null=True, blank=True)
    email_verification_otp = models.CharField(max_length=6, blank=True, null=True)
    phone_verification_otp = models.CharField(max_length=6, blank=True, null=True)