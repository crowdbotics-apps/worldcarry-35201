from django.apps import AppConfig


class PushNotificationConfig(AppConfig):
    name = 'push_notification'

    def ready(self):
        import push_notification.signals