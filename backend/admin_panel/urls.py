from django.urls import path, include
from rest_framework.routers import DefaultRouter
from admin_panel.apps.user.views import UserViewSet

app_name = ""
urlpatterns = [

    path("", include("admin_panel.apps.feedback.urls")),
    path("", include("admin_panel.apps.user.urls")),

]