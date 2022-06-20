# Generated by Django 2.2.28 on 2022-06-20 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_auto_20220620_1226'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='arrival_address_street',
            new_name='arrival_address_street_one',
        ),
        migrations.AddField(
            model_name='order',
            name='arrival_address_postal_code',
            field=models.CharField(blank=True, max_length=16),
        ),
        migrations.AddField(
            model_name='order',
            name='arrival_address_street_two',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
