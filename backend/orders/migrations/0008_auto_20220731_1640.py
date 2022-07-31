# Generated by Django 2.2.26 on 2022-07-31 16:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '0007_auto_20220728_2044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Unpaid', 'Unpaid'), ('Requested', 'Requested'), ('In transit', 'In transit'), ('Recieved', 'Received'), ('Cancelled', 'Cancelled')], default='Unpaid', max_length=64),
        ),
        migrations.CreateModel(
            name='OrderActivityLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('message', models.CharField(max_length=255)),
                ('action_type', models.IntegerField(choices=[(1, 'Order Request Initiated'), (2, 'Order In Transit'), (3, 'Order Received'), (4, 'Order Cancel')])),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activity_log', to='orders.Order')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'orders_order_activity_log',
            },
        ),
    ]
