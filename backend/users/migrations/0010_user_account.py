# Generated by Django 2.2.28 on 2022-08-24 13:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('djstripe', '0008_2_5'),
        ('users', '0009_userpassportimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='account',
            field=models.ForeignKey(blank=True, help_text="The user's Stripe Customer object, if it exists", null=True, on_delete=django.db.models.deletion.SET_NULL, to='djstripe.Customer'),
        ),
    ]
