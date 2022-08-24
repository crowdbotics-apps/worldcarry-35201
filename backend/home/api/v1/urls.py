from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin_panel.apps.support.views import FeedbackAPIView, FAQListAPIView, SupportCreateAPIView
from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ValidatePassport
)
from journeys.views import JourneyViewSet, JourneyOrderRequest
from locations.views import LocationViewSet
from orders.views import OrderViewSet, GetProductDetailView, QRScanOrder, UpdateOrderStatus
from reviews.views import ReviewViewSet
from users.viewsets import UserViewSet
from payments.views import PaymentViewSet

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewSet, basename="users")
router.register("orders", OrderViewSet, basename="orders")
router.register("journeys", JourneyViewSet, basename="journeys")
router.register("locations", LocationViewSet, basename="locations")
router.register("reviews", ReviewViewSet, basename="reviews")
router.register("payments", PaymentViewSet, basename="payments")


urlpatterns = [
    path("", include(router.urls)),
    path("validate/passport",  ValidatePassport.as_view(), name='validate_passport'),
    path("orders/status/update",  UpdateOrderStatus.as_view(), name='order_status_update'),
    path("orders/qr_scan",  QRScanOrder.as_view(), name='qr_scan_order'),
    path("journey/order/request",  JourneyOrderRequest.as_view(), name='journey_order_view'),
    path("get_product_detail", GetProductDetailView.as_view(), name='product_scrape'),
    path("feedback", FeedbackAPIView.as_view(), name='feedback_create'),
    path("faq", FAQListAPIView.as_view(), name='faq_list'),
    path("support", SupportCreateAPIView.as_view(), name='support_create'),
    #path('notifications/', include('notifications_rest.urls')),

]
