# Generated by Django 2.2.28 on 2023-02-07 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0008_auto_20230201_1440'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='is_read',
            field=models.BooleanField(default=False),
        ),
    ]
