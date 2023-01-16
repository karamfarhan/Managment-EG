from django.db import models
from django.db.models.signals import post_delete, pre_delete, pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from PIL import Image

# from apps.account import models
from .untils import (
    get_certificate_image_filepath,
    get_criminal_record_image_filepath,
    get_experience_image_filepath,
    get_identity_image_filepath,
)


class Insurance(models.Model):
    ins_code = models.CharField(
        max_length=250,
        null=False,
        unique=True,
        blank=False,
        verbose_name=_("Insurance code"),
    )
    ins_type = models.CharField(
        max_length=250,
        null=False,
        blank=False,
        verbose_name=_("Insurance type"),
    )
    ins_company = models.CharField(
        max_length=250,
        null=False,
        blank=False,
        verbose_name=_("Insurance issued company"),
    )
    created_by = models.ForeignKey(
        "account.Account",
        on_delete=models.SET_NULL,
        null=True,
        related_name="insurances_created",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    start_at = models.DateField(
        verbose_name=_("insurance started date"),
        null=False,
        blank=False,
    )

    class Meta:
        verbose_name = "Insurance"
        verbose_name_plural = "Insurances"

    def __str__(self):
        return self.ins_code


class Employee(models.Model):
    name = models.CharField(
        max_length=250,
        null=False,
        blank=False,
        unique=True,
        verbose_name=_("employee name"),
    )
    type = models.CharField(
        max_length=250,
        null=False,
        blank=False,
        verbose_name=_("employee type"),
    )
    email = models.EmailField(verbose_name="employee email address", max_length=60, null=False, blank=False)
    email_verified = models.BooleanField(default=False)
    number = models.CharField(verbose_name="employee number", max_length=60, null=True, blank=True)
    created_by = models.ForeignKey(
        "account.Account",
        on_delete=models.SET_NULL,
        null=True,
        related_name="employees_created",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    insurance = models.OneToOneField(
        Insurance, on_delete=models.SET_NULL, null=True, blank=True, related_name="employee"
    )
    certificate_image = models.ImageField(
        max_length=255,
        upload_to=get_certificate_image_filepath,
        null=True,
        blank=True,
        verbose_name=_("employee certificat image"),
    )
    experience_image = models.ImageField(
        max_length=255,
        upload_to=get_experience_image_filepath,
        null=True,
        blank=True,
        verbose_name=_("employee experiance image"),
    )
    identity_image = models.ImageField(
        max_length=255,
        upload_to=get_identity_image_filepath,
        null=True,
        blank=True,
        verbose_name=_("employee identity image"),
    )
    criminal_record_image = models.ImageField(
        max_length=255,
        upload_to=get_criminal_record_image_filepath,
        null=True,
        blank=True,
        verbose_name=_("employee criminal record image"),
    )
    years_of_experiance = models.IntegerField(
        default=0,
        verbose_name=_("employee years of experiance"),
    )
    days_off = models.IntegerField(
        default=0,
        verbose_name=_("employee's days off number"),
    )
    signin_date = models.DateField(
        verbose_name=_("employee signed in date"),
    )
    store = models.ForeignKey(
        "store.Store",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )
    note = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("employee note"),
    )
    is_primary = models.BooleanField(
        default=False,
        verbose_name=_("is the employee is a primary staff"),
    )
    # account = models.OneToOneField(
    #     Account,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="employee_account",
    # )

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"
        ordering = ("-created_at",)

    def __str__(self):
        return self.name


class EmployeeActivity(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="activities")
    is_holiday = models.BooleanField(
        default=False,
        verbose_name=_("is today is holiday day"),
    )
    # created_by = models.ForeignKey(
    #     "account.Account",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     related_name="insurance_created_by",
    # )
    date = models.DateField(
        auto_now_add=True,
        verbose_name=_("employee phase in/out date"),
        editable=False,
    )
    phase_in = models.TimeField(
        verbose_name=_("employee phase in time"),
        null=False,
        blank=False,
    )
    phase_out = models.TimeField(verbose_name=_("employee phase out time"), null=False, blank=False)

    class Meta:
        verbose_name = "Employee Activity"
        verbose_name_plural = "Employee Activities"
        ordering = ["-date"]
        unique_together = ["date", "employee"]

    def __str__(self):
        return f"{self.employee.name}-{self.date}"


@receiver(post_delete, sender=Employee)
def delete_related_items_on_invoice_delete(sender, instance, **kwargs):
    # instance is the deleted invoice object
    if instance.insurance:
        instance.insurance.delete()
