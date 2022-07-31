from django.urls import path, include

from rest_framework.routers import DefaultRouter
from admin_panel.apps.orders_admin.views import OrderListViewSet, CancelOrderView

router = DefaultRouter()
router.register("orders_list", OrderListViewSet, basename="orders_list")

urlpatterns = [
        path("cancel_order", CancelOrderView.as_view(), name="cancel_order")

]+router.urls
