from django.conf import settings
from admin_panel.apps.push_notification import services
from worldcarry_35201.celery import app

from celery import shared_task,current_task
from admin_panel.apps.push_notification import models
import celery


FIREBASE_PUSH_NOTIFICATION = settings.FIREBASE_PUSH_NOTIFICATION


@shared_task(name='tasks.send_notification')
def send_notification(instance):
    if FIREBASE_PUSH_NOTIFICATION:
        services.send_notification_firebase(instance)