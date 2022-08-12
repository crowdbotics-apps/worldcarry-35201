# Generated by Django 2.2.28 on 2022-08-12 19:10

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('push_notification', '0003_notification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='is_active',
        ),
        migrations.AddField(
            model_name='notification',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notification',
            name='is_paused',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='notification',
            name='is_send',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='notification',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
