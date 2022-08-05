from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.feedback.views import FeedbackAPIView, FAQListAPIView
from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
)
from journeys.views import JourneyViewSet, JourneyOrderViewSet
from locations.views import LocationViewSet
from orders.views import OrderViewSet, GetProductDetailView, QRScanOrder
from users.viewsets import UserViewSet

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewSet, basename="users")
router.register("orders", OrderViewSet, basename="orders")
router.register("journeys", JourneyViewSet, basename="journeys")
router.register("journey/orders", JourneyOrderViewSet, basename="journey_orders")
router.register("locations", LocationViewSet, basename="locations")

urlpatterns = [
    path("", include(router.urls)),
    path("orders/qr_scan",  QRScanOrder.as_view(), name='qr_scan_order'),
    path("get_product_detail", GetProductDetailView.as_view(), name='product_scrape'),
    path("feedback", FeedbackAPIView.as_view(), name='feedback-create'),
    path("faq", FAQListAPIView.as_view(), name='faq-list')

]