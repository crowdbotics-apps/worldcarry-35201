from django.contrib import admin

from .models import Order

# Register your models here.
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'total', 'status', 'admin_paid')
    search_fields = ['user', 'created_at', 'total', 'status', 'admin_paid']
