# Generated by Django 2.2.28 on 2022-06-24 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_auto_20220620_1227'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='product_type',
            field=models.CharField(blank=True, choices=[('Electronics', 'Electronics'), ('Jewelry', 'Jewelry'), ('Documents and Books', 'Documents and Books'), ('Food items', 'Food items'), ('Clothing', 'Clothing'), ('Medication', 'Medication')], max_length=255),
        ),
    ]