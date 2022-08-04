from django_celery_beat.models import CrontabSchedule, PeriodicTask
from admin_panel.apps.push_notification.tasks import Pre_Lunch, Follow_Up
import json

def get_day_of_week(instance):
    if instance.days == 'All Days of Week':
        days_of_week = '*'
    if instance.days == 'Every Working Day (Monday - Friday)':
        days_of_week = '1,5'
    if instance.days == 'Every Weekend (Saturday - Sunday)':
        days_of_week = 'sat-sun'
    if instance.days == 'Monday':
        days_of_week = '1'
    if instance.days == 'Tuesday':
        days_of_week = '2'
    if instance.days == 'Wednesday':
        days_of_week = '3'
    if instance.days == 'Thursday':
        days_of_week = '4'
    if instance.days == 'Friday':
        days_of_week = '5'
    if instance.days == 'Saturday':
        days_of_week = 'sat'
    if instance.days == 'Sunday':
        days_of_week = 'sun'
    return days_of_week