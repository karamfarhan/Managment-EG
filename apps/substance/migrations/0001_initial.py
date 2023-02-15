# Generated by Django 4.0 on 2023-02-15 11:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "name",
                    models.CharField(
                        max_length=250, primary_key=True, serialize=False, unique=True, verbose_name="Category name"
                    ),
                ),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
            },
        ),
        migrations.CreateModel(
            name="Substance",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=250, verbose_name="substance name")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="substance information",
                    ),
                ),
                ("is_available", models.BooleanField(default=True, verbose_name="subustance availablity")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                ("units", models.IntegerField(default=1, verbose_name="units available in stock")),
                (
                    "unit_type",
                    models.CharField(
                        choices=[
                            ("كيلوجرام", "كيلوجرام"),
                            ("لتر", "لتر"),
                            ("طن", "طن"),
                            ("متر طولي", "متر طولي"),
                            ("متر مربع", "متر مربع"),
                            ("متر مكعب", "متر مكعب"),
                            ("دهان", "دهان"),
                            ("شكارة 20", "شكارة 20"),
                            ("شكارة 25", "شكارة 25"),
                            ("شكارة 50", "شكارة 50"),
                            ("شكارة معجون", "شكارة معجون"),
                            ("قطعة", "قطعة"),
                        ],
                        max_length=20,
                        verbose_name="Unit Type",
                    ),
                ),
                (
                    "category",
                    models.ManyToManyField(
                        blank=True,
                        related_name="substances",
                        to="substance.Category",
                        verbose_name="substance Category",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="substances_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Substance",
                "verbose_name_plural": "Substances",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="Instrument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=250, verbose_name="instrument name")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="instrument information",
                    ),
                ),
                ("in_action", models.BooleanField(default=False, verbose_name="in action")),
                ("is_working", models.BooleanField(default=True, verbose_name="is working ")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                ("last_maintain", models.DateField(help_text="format: Y-m-d H:M:S", verbose_name="last maintain at")),
                ("maintain_place", models.CharField(max_length=250, verbose_name="place of fixing the instrument")),
                (
                    "category",
                    models.ManyToManyField(
                        blank=True,
                        related_name="instruments",
                        to="substance.Category",
                        verbose_name="instrumen Category",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="instruments_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Instrument",
                "verbose_name_plural": "Instruments",
                "ordering": ("-created_at",),
            },
        ),
    ]
