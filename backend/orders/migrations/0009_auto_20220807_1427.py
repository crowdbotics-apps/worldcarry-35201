# Generated by Django 2.2.26 on 2022-08-07 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0008_auto_20220731_1640'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Unpaid', 'Unpaid'), ('Requested', 'Requested'), ('In transit', 'In transit'), ('Received', 'Received'), ('Cancelled', 'Cancelled')], default='Unpaid', max_length=64),
        ),
    ]
