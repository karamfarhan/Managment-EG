from apps.account.models import Account
from apps.store.models import Store
from core.utils import unique_slug_generator
from django.db import models
from django.db.models.signals import pre_save
from django.utils.translation import gettext_lazy as _
from PIL import Image


class SubstanceCategory(models.Model):
    name = models.CharField(
        max_length=250,
        null=False,
        unique=True,
        blank=False,
        verbose_name=_("Category name"),
    )

    class Meta:
        verbose_name = "Substance Category"
        verbose_name_plural = "Substance Categories"

    def __str__(self):
        return self.name


class Substance(models.Model):
    UNIT_TYPE = (("KILOGRAM", "KL"), ("LITER", "L"), ("TON", "T"))
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
        SubstanceCategory,
        related_name="categories",
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
    units = models.BigIntegerField(
        default=0,
        verbose_name=_("units available in stock"),
    )
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPE, verbose_name=_("Unit Type"))

    class Meta:
        verbose_name = "Substance"
        verbose_name_plural = "Substances"

    def __str__(self):
        return self.name


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
    last_maintain = models.DateTimeField(
        verbose_name=_("last maintain at"),
        help_text=_("format: Y-m-d H:M:S"),
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
        on_delete=models.PROTECT,
        related_name="invoice_store",
    )
    substances = models.ManyToManyField(
        Substance, through="substance.InvoiceSubstanceItem", related_name="invoice_substance"
    )
    instruments = models.ManyToManyField(
        Instrument, through="substance.InvoiceInstrumentItem", related_name="invoice_instrument"
    )

    def __str__(self):
        return f"Invoice-{self.pk} - for Store {self.store.pk}"


class InvoiceSubstanceItem(models.Model):
    substance = models.ForeignKey(
        Substance,
        on_delete=models.CASCADE,
    )
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
    )
    mass = models.BigIntegerField(
        default=0,
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
    instrument = models.ForeignKey(
        Instrument,
        on_delete=models.CASCADE,
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
