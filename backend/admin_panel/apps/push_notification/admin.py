from django.contrib import admin
from admin_panel.apps.push_notification.models import *

# Register your models here.

admin.site.register(Template)
admin.site.register(Push_Notification_Group)
admin.site.register(Notification_Schedular)