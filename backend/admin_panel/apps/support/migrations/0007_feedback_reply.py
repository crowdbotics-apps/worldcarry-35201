# Generated by Django 2.2.28 on 2023-02-01 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0006_merge_20220825_1629'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='reply',
            field=models.TextField(blank=True, null=True),
        ),
    ]
