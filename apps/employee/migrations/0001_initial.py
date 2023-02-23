# Generated by Django 4.0 on 2023-02-23 20:54

import django.db.models.deletion
from django.db import migrations, models

import apps.employee.untils


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("store", "0001_initial"),
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Insurance",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("ins_code", models.CharField(max_length=250, unique=True, verbose_name="Insurance code")),
                ("ins_type", models.CharField(max_length=250, verbose_name="Insurance type")),
                ("ins_company", models.CharField(max_length=250, verbose_name="Insurance issued company")),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                ("start_at", models.DateField(verbose_name="insurance started date")),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="insurances_created",
                        to="account.account",
                    ),
                ),
            ],
            options={
                "verbose_name": "Insurance",
                "verbose_name_plural": "Insurances",
            },
        ),
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=250, verbose_name="employee name")),
                ("type", models.CharField(max_length=250, verbose_name="employee type")),
                (
                    "email",
                    models.EmailField(blank=True, max_length=60, null=True, verbose_name="employee email address"),
                ),
                ("email_verified", models.BooleanField(default=False)),
                ("number", models.CharField(blank=True, max_length=60, null=True, verbose_name="employee number")),
                (
                    "employee_category",
                    models.CharField(
                        choices=[("مهندس", "مهندس"), ("سائق", "سائق")], max_length=20, verbose_name="employee category"
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True, help_text="format: Y-m-d H:M:S", verbose_name="creatred at"
                    ),
                ),
                (
                    "certificate_image",
                    models.ImageField(
                        blank=True,
                        max_length=255,
                        null=True,
                        upload_to=apps.employee.untils.get_certificate_image_filepath,
                        verbose_name="employee certificat image",
                    ),
                ),
                (
                    "experience_image",
                    models.ImageField(
                        blank=True,
                        max_length=255,
                        null=True,
                        upload_to=apps.employee.untils.get_experience_image_filepath,
                        verbose_name="employee experiance image",
                    ),
                ),
                (
                    "identity_image",
                    models.ImageField(
                        blank=True,
                        max_length=255,
                        null=True,
                        upload_to=apps.employee.untils.get_identity_image_filepath,
                        verbose_name="employee identity image",
                    ),
                ),
                (
                    "criminal_record_image",
                    models.ImageField(
                        blank=True,
                        max_length=255,
                        null=True,
                        upload_to=apps.employee.untils.get_criminal_record_image_filepath,
                        verbose_name="employee criminal record image",
                    ),
                ),
                ("years_of_experiance", models.IntegerField(default=0, verbose_name="employee years of experiance")),
                ("days_off", models.IntegerField(default=0, verbose_name="employee's days off number")),
                ("signin_date", models.DateField(blank=True, null=True, verbose_name="employee signed in date")),
                (
                    "note",
                    models.TextField(
                        blank=True, default="No description", max_length=500, null=True, verbose_name="employee note"
                    ),
                ),
                ("is_primary", models.BooleanField(default=False, verbose_name="is the employee is a primary staff")),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="employees_created",
                        to="account.account",
                    ),
                ),
                (
                    "insurance",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="employee",
                        to="employee.insurance",
                    ),
                ),
                (
                    "store",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="employees",
                        to="store.store",
                    ),
                ),
            ],
            options={
                "verbose_name": "Employee",
                "verbose_name_plural": "Employees",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="EmployeeActivity",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_holiday", models.BooleanField(default=False, verbose_name="is today is holiday day")),
                ("date", models.DateField(auto_now_add=True, verbose_name="employee phase in/out date")),
                ("phase_in", models.TimeField(blank=True, null=True, verbose_name="employee phase in time")),
                ("phase_out", models.TimeField(blank=True, null=True, verbose_name="employee phase out time")),
                (
                    "address",
                    models.CharField(blank=True, max_length=250, null=True, verbose_name="address of phas in time"),
                ),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="activities", to="employee.employee"
                    ),
                ),
            ],
            options={
                "verbose_name": "Employee Activity",
                "verbose_name_plural": "Employee Activities",
                "ordering": ["-date"],
                "unique_together": {("date", "employee")},
            },
        ),
    ]
