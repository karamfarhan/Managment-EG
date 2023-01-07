# Generated by Django 4.0 on 2023-01-07 18:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("account", "0001_initial"),
        ("store", "0001_initial"),
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
                ("in_action", models.BooleanField(default=False, verbose_name="instrument availablity")),
                ("is_working", models.BooleanField(default=True, verbose_name="is working ")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                (
                    "ins_type",
                    models.CharField(
                        choices=[("Handed", "Handed"), ("Mechian", "Mechian")], max_length=20, verbose_name="Unit Type"
                    ),
                ),
                ("last_maintain", models.DateField(help_text="format: Y-m-d H:M:S", verbose_name="last maintain at")),
                (
                    "category",
                    models.ManyToManyField(
                        related_name="instrument_categories",
                        to="substance.Category",
                        verbose_name="instrumen Category",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="instrument_account",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Instrument",
                "verbose_name_plural": "Instruments",
            },
        ),
        migrations.CreateModel(
            name="Invoice",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="invoice_account",
                        to="account.account",
                    ),
                ),
            ],
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
                        choices=[("KL", "KILOGRAM"), ("L", "LITER"), ("T", "TON")],
                        max_length=20,
                        verbose_name="Unit Type",
                    ),
                ),
                (
                    "category",
                    models.ManyToManyField(
                        related_name="substance_categories", to="substance.Category", verbose_name="substance Category"
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="substance_account",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Substance",
                "verbose_name_plural": "Substances",
            },
        ),
        migrations.CreateModel(
            name="InvoiceSubstanceItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("mass", models.BigIntegerField(default=0, verbose_name="invoice substance mass")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="invoice substance information",
                    ),
                ),
                ("invoice", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="substance.invoice")),
                (
                    "substance",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="substance.substance"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="InvoiceInstrumentItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="invoice instrument information",
                    ),
                ),
                (
                    "instrument",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="substance.instrument"),
                ),
                ("invoice", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="substance.invoice")),
            ],
        ),
        migrations.AddField(
            model_name="invoice",
            name="instruments",
            field=models.ManyToManyField(
                related_name="invoice_instrument", through="substance.InvoiceInstrumentItem", to="substance.Instrument"
            ),
        ),
        migrations.AddField(
            model_name="invoice",
            name="store",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, related_name="invoice_store", to="store.store"
            ),
        ),
        migrations.AddField(
            model_name="invoice",
            name="substances",
            field=models.ManyToManyField(
                related_name="invoice_substance", through="substance.InvoiceSubstanceItem", to="substance.Substance"
            ),
        ),
    ]