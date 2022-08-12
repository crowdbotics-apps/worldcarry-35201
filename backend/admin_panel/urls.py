from django.urls import path, include

app_name = ""
urlpatterns = [

    path("", include("admin_panel.apps.support.urls")),
    path("", include("admin_panel.apps.user.urls")),
    path("", include("admin_panel.apps.orders_admin.urls")),
    path("", include("admin_panel.apps.push_notification.urls")),

]