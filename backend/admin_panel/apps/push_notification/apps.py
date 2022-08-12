from django.apps import AppConfig


class PushNotificationConfig(AppConfig):
    name = 'push_notification'

    def ready(self):
        try:
            import admin_panel.apps.push_notification.signals
        except ImportError:
            pass