# Generated by Django 2.2.28 on 2022-08-12 18:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('push_notification', '0001_initial'),
    ]
    operations = [
        migrations.RunSQL('DROP TABLE IF EXISTS push_notification_notification_schedular;'),
        migrations.RunSQL('DROP TABLE IF EXISTS push_notification_template;'),
        migrations.RunSQL('DROP TABLE IF EXISTS push_notification_notification_schedular;'),
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True, verbose_name='Name of Template')),
                ('description', models.TextField(verbose_name='Description of Notification')),
                ('image', models.ImageField(blank=True, null=True, upload_to='push_notification_images')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Template',
                'verbose_name_plural': 'Templates',
            },
        ),
        migrations.CreateModel(
            name='PushNotificationGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, choices=[('Pre Lunch', 'Pre Lunch'), ('Post Lunch', 'Post Lunch'), ('Follow Up', 'Follow Up')], max_length=200, null=True, verbose_name='Name of Group')),
                ('users', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Push Notification Group',
                'verbose_name_plural': 'Push Notification Groups',
            },
        ),
        migrations.CreateModel(
            name='NotificationSchedular',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, choices=[('Pre Lunch', 'Pre Lunch'), ('Post Lunch', 'Post Lunch'), ('Follow Up', 'Follow Up')], max_length=200, null=True, verbose_name='Name of Schedular')),
                ('time', models.TimeField()),
                ('days', models.CharField(blank=True, choices=[('All Days of Week', 'All Days of Week'), ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'), ('Sunday', 'Sunday'), ('Every Working Day (Monday - Friday)', 'Every Working Day (Monday - Friday)'), ('Every Weekend (Saturday - Sunday)', 'Every Weekend (Saturday - Sunday)')], max_length=255, null=True, verbose_name='Repetition Days')),
                ('is_active', models.BooleanField(default=True)),
                ('group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='push_notification.PushNotificationGroup')),
                ('template', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='push_notification.Template')),
                ('users', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Push Notification Schedular',
                'verbose_name_plural': 'Push Notification Schedulars',
            },
        ),
    ]