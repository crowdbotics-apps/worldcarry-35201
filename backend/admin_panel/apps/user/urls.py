from django.urls import path, include
from rest_framework.routers import DefaultRouter
from admin_panel.apps.user.views import UserViewSet

router = DefaultRouter()
router.register("user", UserViewSet, basename="user")


urlpatterns = [

]+router.urls
