from apps.account.models import Account
from apps.store.models import Store
from core.utils import unique_slug_generator
from django.db import models
from django.db.models import F
from django.db.models.signals import post_delete, pre_delete, pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from PIL import Image
from rest_framework import serializers


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
    UNIT_TYPE = (("kilogram", "kilogram"), ("liter", "liter"), ("ton", "ton"))
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="substances_created",
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
        verbose_name=_("substance Category"),
        blank=True,
        related_name="substances",
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
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="instruments_created",
    )
    name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("instrument name"),
    )
    category = models.ManyToManyField(
        Category, verbose_name=_("instrumen Category"), blank=True, related_name="instruments"
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
        verbose_name=_("in action"),
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


class InvoiceSubstanceItem(models.Model):
    substance = models.ForeignKey(
        Substance, on_delete=models.CASCADE, null=True, blank=True, related_name="invoices_items"
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
    instrument = models.ForeignKey(
        Instrument, on_delete=models.CASCADE, null=True, blank=True, related_name="invoices_items"
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("invoice instrument information"),
    )


class Invoice(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
    )
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="invoices_created",
    )
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="invoices",
    )
    # TODO i think there a mistake here, the item istance should be in one invoice
    # TODO so many to many here is wrong, should re-design the relationship
    substances = models.ManyToManyField(InvoiceSubstanceItem, related_name="invoice")
    instruments = models.ManyToManyField(InvoiceInstrumentItem, related_name="invoice")
    note = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("invoice note"),
    )

    def __str__(self):
        return f"Invoice-{self.pk} - for Store {self.store.pk}"

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ["-created_at"]


@receiver(pre_delete, sender=InvoiceInstrumentItem)
def update_instrument_action(sender, instance, **kwargs):
    instance.instrument.in_action = False
    instance.instrument.save()


@receiver(pre_delete, sender=Invoice)
def delete_related_items_on_invoice_delete(sender, instance, **kwargs):
    # instance is the deleted invoice object
    instance.substances.all().delete()
    instance.instruments.all().delete()
