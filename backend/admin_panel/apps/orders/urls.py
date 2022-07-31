from rest_framework.routers import DefaultRouter
from admin_panel.apps.orders.views import OrderListViewSet

router = DefaultRouter()
router.register("orders_list", OrderListViewSet, basename="orders_list")


urlpatterns = [

]+router.urls
