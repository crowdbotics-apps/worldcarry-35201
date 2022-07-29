from django.contrib import admin

# Register your models here.
from admin_panel.apps.feedback.models import Feedback

admin.site.register(Feedback)