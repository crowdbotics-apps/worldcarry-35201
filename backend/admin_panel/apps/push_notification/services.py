from django_celery_beat.models import CrontabSchedule, PeriodicTask
from admin_panel.apps.push_notification.tasks import Pre_Lunch, Follow_Up
from admin_panel.apps.push_notification.utils import get_day_of_week
from admin_panel.apps.push_notification.models import Notification_Schedular
import json


def get_or_create_crontab_schedule(instance):
    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute=instance.time.minute,
        hour=instance.time.hour,
        day_of_week=get_day_of_week(instance),
        day_of_month='*',
        month_of_year='*',
    )
    return schedule, _


def delete_cronjob_instance(instance):
    task = PeriodicTask.objects.filter(name='{}-{}'.format(instance.name, instance.id))
    task.delete()


def create_or_update_periodic_task(instance, schedule):
    if instance.name == 'Pre Lunch':
        task = PeriodicTask.objects.filter(name='{}-{}'.format(instance.name, instance.id))
        if task.exists():
            task.update(
                crontab=schedule, 
                enabled=instance.is_active,
                task='tasks.Pre_Lunch',
                args= json.dumps([instance.id])
            )
        else:
            PeriodicTask.objects.create(
                name='{}-{}'.format(instance.name, instance.id),
                task='tasks.Pre_Lunch',
                crontab=schedule,
                args= json.dumps([instance.id])
            )

    if instance.name == 'Follow Up':
        task = PeriodicTask.objects.filter(name='{}-{}'.format(instance.name, instance.id))
        if task.exists():
            task.update(
                crontab=schedule, 
                task='tasks.Follow_Up',
                enabled=instance.is_active,
                args= json.dumps([instance.id])
            )
        else:
            PeriodicTask.objects.create(
                name='{}-{}'.format(instance.name, instance.id),
                task='tasks.Follow_Up',
                crontab=schedule,
                args= json.dumps([instance.id])
            )

def send_notification_firebase(instance):
    instance = Notification_Schedular.objects.get(id=instance)
    print('-----------------send_notification_firebase-----------------')
    print(instance.name)
    print(instance.time)