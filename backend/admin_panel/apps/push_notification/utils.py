from fcm_django.models import FCMDevice


def delete_device(user_id):
    return FCMDevice.objects.filter(user=user_id).delete()


def activate_device(user_id):
    return FCMDevice.objects.filter(user=user_id).update(active=True)


def send_notification(user_id, title, message, data = {}):
    try:
        device = FCMDevice.objects.filter(user=user_id).last()
        result = device.send_message(title=title, body=message, data=data, sound=True)
        return result
    except:
        pass