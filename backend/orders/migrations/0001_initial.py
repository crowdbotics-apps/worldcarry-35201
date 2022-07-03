# Generated by Django 2.2.28 on 2022-06-20 11:29

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('product_name', models.CharField(blank=True, max_length=255)),
                ('product_type', models.CharField(blank=True, choices=[('Electronics', 'Electronics'), ('Cosmetics', 'Cosmetics'), ('Raw Materials', 'Raw Materials')], max_length=255)),
                ('product_link', models.CharField(blank=True, max_length=255)),
                ('product_price', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('carrier_reward', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('expected_wait_time', models.CharField(blank=True, choices=[('Up to 2 weeks', 'Up to 2 weeks'), ('Up to 3 weeks', 'Up to 3 weeks'), ('Up to 1 month', 'Up to 1 month'), ('Up to 2 months', 'Up to 2 months'), ('Up to 3 months', 'Up to 3 months')], max_length=64)),
                ('description', models.TextField(blank=True)),
                ('pickup_address_coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('pickup_address_street', models.CharField(blank=True, max_length=255)),
                ('pickup_address_city', models.CharField(blank=True, max_length=255)),
                ('pickup_address_state', models.CharField(blank=True, max_length=255)),
                ('pickup_address_country', models.CharField(blank=True, max_length=255)),
                ('arrival_address_coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('arrival_address_street', models.CharField(blank=True, max_length=255)),
                ('arrival_address_city', models.CharField(blank=True, max_length=255)),
                ('arrival_address_state', models.CharField(blank=True, max_length=255)),
                ('arrival_address_country', models.CharField(blank=True, max_length=255)),
                ('subtotal', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('total', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('status', models.CharField(choices=[('Unpaid', 'Unpaid'), ('Requested', 'Requested'), ('In transit', 'In transit'), ('Recieved', 'Received')], default='Unpaid', max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('deliver_before_date', models.DateField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrderImages',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('image', models.ImageField(upload_to='orders/images')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='orders.Order')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]