# Generated by Django 4.0 on 2023-02-23 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('car', '0002_car_car_counter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='note',
            field=models.TextField(blank=True, max_length=500, null=True, verbose_name='car note'),
        ),
    ]
