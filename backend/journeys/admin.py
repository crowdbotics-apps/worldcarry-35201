from django.contrib import admin

from journeys.models import Journey, JourneyOrder, DeclineJourneyOrder

# Register your models here.
admin.site.register(Journey)
admin.site.register(JourneyOrder)
admin.site.register(DeclineJourneyOrder)