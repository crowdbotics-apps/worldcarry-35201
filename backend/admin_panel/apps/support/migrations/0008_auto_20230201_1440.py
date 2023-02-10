# Generated by Django 2.2.28 on 2023-02-01 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0007_feedback_reply'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='email',
            field=models.EmailField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='feedback',
            name='message',
            field=models.TextField(blank=True, null=True),
        ),
    ]