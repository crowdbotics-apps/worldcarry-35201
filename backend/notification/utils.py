from fcm_django.models import FCMDevice
from notification.models import Notification as NotificationLog

from firebase_admin.messaging import Message, Notification


def send_notification(user_id, title, message, data=None):
    try:
        device = FCMDevice.objects.filter(user_id=user_id).last()
        result = device.send_message(Message(notification=Notification(title="title", body="body")))
        NotificationLog.objects.create(user_id=user_id, title=title, message=message, response=str(result))
        return result
    except Exception as ex:
        print(ex)
