from django.contrib import admin

# Register your models here.
from admin_panel.apps.support.models import Feedback, SupportRequest, FAQ, FeedbackMedia, SupportRequestMedia

admin.site.register(Feedback)
admin.site.register(SupportRequest)
admin.site.register(FAQ)
admin.site.register(FeedbackMedia)
admin.site.register(SupportRequestMedia)