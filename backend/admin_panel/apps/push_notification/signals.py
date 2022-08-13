# from admin_panel.apps.push_notification.services import  create_or_update_periodic_task, get_or_create_crontab_schedule, delete_cronjob_instance
# from django_celery_beat.models import CrontabSchedule, PeriodicTask
from admin_panel.apps.push_notification.models import Notification_Schedular, Notification
from django.db.models.signals import post_save,pre_delete
# from admin_panel.apps.push_notification.utils import get_day_of_week
from django.dispatch import receiver
from admin_panel.apps.push_notification.utils import send_notification

# @receiver(post_save, sender=Notification_Schedular, dispatch_uid="create_cronjob")
# def create_cronjob(sender, instance, **kwargs):
#     schedule, _ = get_or_create_crontab_schedule(instance)
#     create_or_update_periodic_task(instance, schedule)
#
#
# @receiver(pre_delete, sender=Notification_Schedular)
# def delete_cronjob(sender, instance, **kwargs):
#     delete_cronjob_instance(instance)


@receiver(post_save, sender=Notification)
def send_notification_signal(sender, instance:Notification, **kwargs):
    result = send_notification(
        user_id=instance.user.id,
        message=instance.description,
        title=instance.name
    )
    print(result)
    instance.is_sent=True
    instance.save()