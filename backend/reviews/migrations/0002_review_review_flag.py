# Generated by Django 2.2.28 on 2023-02-21 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='review_flag',
            field=models.BooleanField(default=False),
        ),
    ]
