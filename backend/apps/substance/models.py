from apps.account.models import Account
from apps.store.models import Store
from core.utils import unique_slug_generator
from django.db import models
from django.db.models.signals import pre_save
from django.utils.translation import gettext_lazy as _
from PIL import Image


class Category(models.Model):
    name = models.CharField(
        primary_key=True,
        max_length=250,
        null=False,
        unique=True,
        blank=False,
        verbose_name=_("Category name"),
    )

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Substance(models.Model):
    UNIT_TYPE = (("KL", "KILOGRAM"), ("L", "LITER"), ("T", "TON"))
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="substance_account",
    )
    name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("substance name"),
    )
    category = models.ManyToManyField(
        Category,
        related_name="substance_categories",
        verbose_name=_("substance Category"),
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("substance information"),
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name=_("subustance availablity"),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    units = models.IntegerField(
        default=1,
        verbose_name=_("units available in stock"),
    )
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPE, verbose_name=_("Unit Type"))

    class Meta:
        verbose_name = "Substance"
        verbose_name_plural = "Substances"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.units <= 0:
            self.is_available = False
        else:
            self.is_available = True
        super().save(*args, **kwargs)


class Instrument(models.Model):
    TYPE = (("Handed", "Handed"), ("Mechian", "Mechian"))
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="instrument_account",
    )
    name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("instrument name"),
    )
    category = models.ManyToManyField(
        Category,
        related_name="instrument_categories",
        verbose_name=_("instrumen Category"),
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("instrument information"),
    )
    in_action = models.BooleanField(
        default=False,
        verbose_name=_("instrument availablity"),
    )
    is_working = models.BooleanField(
        default=True,
        verbose_name=_("is working "),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )

    ins_type = models.CharField(max_length=20, choices=TYPE, verbose_name=_("Unit Type"))
    last_maintain = models.DateField(
        # format=None,
        # input_formats=['%Y-%m-%d',],
        verbose_name=_("last maintain at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    maintain_place = models.CharField(
        max_length=250, null=False, blank=False, verbose_name=_("place of fixing the instrument")
    )

    class Meta:
        verbose_name = "Instrument"
        verbose_name_plural = "Instruments"

    def __str__(self):
        return self.name


class Invoice(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
    )
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="invoice_account",
    )
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="invoice_store",
    )
    substances_data = models.ManyToManyField(Substance, through="InvoiceSubstanceItem")
    instruments_data = models.ManyToManyField(Instrument, through="InvoiceInstrumentItem")
    note = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("invoice note"),
    )

    def __str__(self):
        return f"Invoice-{self.pk} - for Store {self.store.pk}"


class InvoiceSubstanceItem(models.Model):
    sub = models.ForeignKey(Substance, on_delete=models.CASCADE, null=True, blank=True)
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
    )
    mass = models.BigIntegerField(
        null=False,
        blank=False,
        verbose_name=_("invoice substance mass"),
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("invoice substance information"),
    )


class InvoiceInstrumentItem(models.Model):
    ins = models.ForeignKey(
        Instrument,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("invoice instrument information"),
    )
