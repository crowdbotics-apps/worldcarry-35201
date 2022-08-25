from admin_panel.apps.push_notification.constant import Push_Notification_Repeating_Days, Notication_Group_Name, Push_Notification_Type
from django.utils.translation import ugettext_lazy as _
from users.models import User
from django.db import models


class Template(models.Model):
    name = models.CharField(_("Name of Template"), max_length=200, null=True, blank=True)
    description = models.TextField(_("Description of Notification"))
    image = models.ImageField(upload_to ='push_notification_images', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Template"
        verbose_name_plural = "Templates"
    
    def __str__(self):
        return self.name


class PushNotificationGroup(models.Model):
    name = models.CharField(
        _("Name of Group"), max_length=200, null=True, blank=True,
        choices=[(role.value, role.value) for role in Notication_Group_Name]
    )
    users = models.ManyToManyField(User, blank=True)

    class Meta:
        verbose_name = "Push Notification Group"
        verbose_name_plural = "Push Notification Groups"

    def __str__(self):
        return self.name


class NotificationSchedular(models.Model):
    name = models.CharField(
        _("Name of Schedular"), max_length=200, null=True, blank=True,
        choices=[(role.value, role.value) for role in Push_Notification_Type]
    )
    time = models.TimeField()
    days = models.CharField(
      _('Repetition Days'),max_length=255,blank=True, null=True,
      choices=[(role.value, role.value) for role in Push_Notification_Repeating_Days]
    )
    template = models.ForeignKey(Template, on_delete=models.CASCADE, null=True,blank=True)
    group = models.ForeignKey(PushNotificationGroup, on_delete=models.CASCADE, null=True, blank=True)
    users = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Push Notification Schedular"
        verbose_name_plural = "Push Notification Schedulars"
    
    def __str__(self):
        return self.name


class Notification(models.Model):
    name = models.CharField(_("Name of Template"), max_length=200, null=True, blank=True)
    description = models.TextField(_("Description of Notification"))
    image = models.ImageField(upload_to='push_notification_images', null=True, blank=True)
    is_send_now = models.BooleanField(default=False)
    send_date = models.DateTimeField(null=True, blank=True)
    group = models.ForeignKey(PushNotificationGroup, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    is_paused = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        verbose_name = "Push Notification"
        verbose_name_plural = "Push Notification"

    def __str__(self):
        return self.name

    # def save(self, request=None):
    #     print("testings")
    #
    #     return super().save()