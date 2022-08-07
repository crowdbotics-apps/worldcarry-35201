from ideapros_llc_nectar_32416.settings import FIREBASE_PUSH_NOTIFICATION
from admin_panel.apps.push_notification import services
from ideapros_llc_nectar_32416.celery import app
from celery import shared_task,current_task
from admin_panel.apps.push_notification import models
import celery


@shared_task(name='tasks.Pre_Lunch')
def Pre_Lunch(instance):
    print('-----------------Pre_Lunch-----------------')
    if FIREBASE_PUSH_NOTIFICATION:
       services.send_notification_firebase(instance)

@shared_task(name='tasks.Follow_Up')
def Follow_Up(instance):
    print('-----------------Post_Lunch-----------------')
    if FIREBASE_PUSH_NOTIFICATION:
       services.send_notification_firebase(instance)

@shared_task(name='tasks.Post_Lunch')
def Post_Lunch(instance):
    print('-----------------Post_Lunch-----------------')
    if FIREBASE_PUSH_NOTIFICATION:
       services.send_notification_firebase(instance)