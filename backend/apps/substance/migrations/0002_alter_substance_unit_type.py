# Generated by Django 4.0 on 2023-01-21 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("substance", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="substance",
            name="unit_type",
            field=models.CharField(
                choices=[
                    ("kilogram", "kilogram"),
                    ("liter", "liter"),
                    ("ton", "ton"),
                    ("m3", "m3 "),
                    ("m2", "m2"),
                    ("item", "item"),
                ],
                max_length=20,
                verbose_name="Unit Type",
            ),
        ),
    ]
