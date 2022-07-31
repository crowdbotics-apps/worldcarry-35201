from django.urls import path, include

app_name = ""
urlpatterns = [

    path("", include("admin_panel.apps.feedback.urls")),
    path("", include("admin_panel.apps.user.urls")),
    path("", include("admin_panel.apps.orders.urls")),

]