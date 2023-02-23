# Generated by Django 4.0 on 2023-02-15 16:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("employee", "0001_initial"),
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Car",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("car_model", models.CharField(blank=True, max_length=250, null=True, verbose_name="car model")),
                ("car_type", models.CharField(blank=True, max_length=250, null=True, verbose_name="car type")),
                ("car_number", models.CharField(blank=True, max_length=250, null=True, verbose_name="car number")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                ("note", models.TextField(blank=True, max_length=500, null=True, verbose_name="car note")),
                (
                    "car_counter",
                    models.TextField(
                        blank=True, default="No description", max_length=500, null=True, verbose_name="car counter"
                    ),
                ),
                (
                    "last_maintain",
                    models.DateField(
                        blank=True, help_text="format: Y-m-d H:M:S", null=True, verbose_name="last maintain at"
                    ),
                ),
                (
                    "maintain_place",
                    models.CharField(blank=True, max_length=250, null=True, verbose_name="place of fixing the car"),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="cars_created",
                        to="account.account",
                    ),
                ),
                (
                    "driver",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="cars",
                        to="employee.employee",
                    ),
                ),
            ],
            options={
                "verbose_name": "Car",
                "verbose_name_plural": "Cars",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="CarActivity",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                ("driver", models.CharField(blank=True, max_length=250, null=True, verbose_name="the driver")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="Car activity note",
                    ),
                ),
                ("activity_date", models.DateField(help_text="format: Y-m-d H:M:S", verbose_name="activity date")),
                ("distance", models.IntegerField(verbose_name="the car distance")),
                (
                    "car",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="activities", to="car.car"
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="caractivities_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Car Activity",
                "verbose_name_plural": "Cars Activity",
                "ordering": ("-activity_date",),
            },
        ),
        migrations.CreateModel(
            name="CarActivityRide",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "place_from",
                    models.CharField(blank=True, max_length=250, null=True, verbose_name="ride from-place"),
                ),
                ("place_to", models.CharField(blank=True, max_length=250, null=True, verbose_name="ride to-place")),
                (
                    "activity",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="rides", to="car.caractivity"
                    ),
                ),
            ],
        ),
    ]
