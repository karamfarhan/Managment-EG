# Generated by Django 4.0 on 2023-02-15 11:33

import django.db.models.deletion
from django.db import migrations, models

import apps.store.utils


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("substance", "0001_initial"),
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Invoice",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("note", models.TextField(blank=True, null=True, verbose_name="invoice note")),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="invoices_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Invoice",
                "verbose_name_plural": "Invoices",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Store",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=250, verbose_name="store name")),
                ("address", models.CharField(max_length=250, verbose_name="Store Address")),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        default="No description",
                        max_length=500,
                        null=True,
                        verbose_name="Store information",
                    ),
                ),
                ("active_status", models.BooleanField(default=True, verbose_name="Store status")),
                (
                    "start_at",
                    models.DateTimeField(auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="start at"),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="stores_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Store",
                "verbose_name_plural": "Stores",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="MediaPack",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("alt_text", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="mediapacks_created",
                        to="account.account",
                    ),
                ),
                (
                    "store",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="mediapacks", to="store.store"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="InvoiceSubstanceItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("mass", models.BigIntegerField(verbose_name="invoice substance mass")),
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
                (
                    "invoice",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="substance_items", to="store.invoice"
                    ),
                ),
                (
                    "substance",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="invoices_items",
                        to="substance.substance",
                    ),
                ),
            ],
            options={
                "verbose_name": "Invoice Substance Item",
                "verbose_name_plural": "Invoices Substances Items",
            },
        ),
        migrations.AddField(
            model_name="invoice",
            name="store",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="invoices", to="store.store"
            ),
        ),
        migrations.CreateModel(
            name="Image",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(max_length=255, upload_to=apps.store.utils.get_store_images_filepath)),
                (
                    "media_pack",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="images", to="store.mediapack"
                    ),
                ),
            ],
            options={
                "verbose_name": "Image",
                "verbose_name_plural": "Images",
                "ordering": ("-media_pack__created_at",),
            },
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
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="invoices_items",
                        to="substance.instrument",
                    ),
                ),
                (
                    "invoice",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="instrument_items",
                        to="store.invoice",
                    ),
                ),
            ],
            options={
                "verbose_name": "Invoice Instrument Item",
                "verbose_name_plural": "Invoices Instrument Items",
                "unique_together": {("instrument", "invoice")},
            },
        ),
    ]
