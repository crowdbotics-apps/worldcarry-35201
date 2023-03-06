from admin_panel.apps.push_notification.utils import send_notification
from admin_panel.apps.push_notification.models import Notification
from django.forms.models import model_to_dict


def create_notification(data:dict) -> Notification:
    notification = Notification.objects.create(
        name=data.get("name", ""),
        description=data.get("description", ""),
        image=data.get("images", ""),
        user=data.get("user", ""),
        object_id=data.get("object_id"),
        content_type=data.get("content_type"),
        send_date=data.get("send_date"),
        is_send_now=data.get("is_send_now", False),
        type=data.get("type")
        
    )
    if notification.user.profile.send_notification:
        send_notification(
            user=notification.user,
            title=notification.name,
            message=notification.description,
            data={
                "image": notification.image.url if notification.image else None,
                "type": notification.type,
                "object_id": str(notification.object_id),
                "content_type":  model_to_dict(notification.content_type)
            }
        )
    return notification
