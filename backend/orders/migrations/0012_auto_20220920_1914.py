# Generated by Django 2.2.26 on 2022-09-20 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0011_order_admin_paid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Unpaid', 'Unpaid'), ('Requested', 'Requested'), ('Accepted', 'Accepted'), ('In transit', 'In transit'), ('Received', 'Received'), ('Cancelled', 'Cancelled')], default='Requested', max_length=64),
        ),
    ]
