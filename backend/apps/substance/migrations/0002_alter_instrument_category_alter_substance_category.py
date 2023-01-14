# Generated by Django 4.0 on 2023-01-14 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("substance", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="instrument",
            name="category",
            field=models.ManyToManyField(
                related_name="instrument_categories", to="substance.Category", verbose_name="instrumen Category"
            ),
        ),
        migrations.AlterField(
            model_name="substance",
            name="category",
            field=models.ManyToManyField(
                related_name="substance_categories", to="substance.Category", verbose_name="substance Category"
            ),
        ),
    ]
