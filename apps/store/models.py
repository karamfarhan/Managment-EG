# from core.utils import unique_slug_generator
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver

# from apps.substance.models import Substance,Instrument
# from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _

from apps.account.models import Account

# from PIL import Image as p_image
from apps.substance.models import Instrument, Substance

from .utils import get_store_images_filepath

# from django.db.models.signals import pre_save


class Store(models.Model):
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="stores_created",
    )
    name = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("store name"),
    )
    address = models.CharField(
        max_length=250,
        null=False,
        unique=False,
        blank=False,
        verbose_name=_("Store Address"),
    )
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("Store information"),
    )
    active_status = models.BooleanField(
        default=True,
        verbose_name=_("Store status"),
    )
    # TODO change to date filed not datetime filed
    start_at = models.DateTimeField(
        verbose_name=_("start at"),
        auto_now_add=True,
        help_text=_("format: Y-m-d H:M:S"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )

    class Meta:
        verbose_name = "Store"
        verbose_name_plural = "Stores"
        ordering = ["-created_at"]

    def __str__(self):
        return self.address


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
    # TODO -> make the relation on the items model and change the relation to
    # substances = models.ManyToManyField("store.InvoiceSubstanceItem", related_name="invoice")
    # instruments = models.ManyToManyField("store.InvoiceInstrumentItem", related_name="invoice")
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


class InvoiceSubstanceItem(models.Model):
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE, related_name="invoices_items")
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="substance_items")
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

    class Meta:
        verbose_name = "Invoice Substance Item"
        verbose_name_plural = "Invoices Substances Items"


class InvoiceInstrumentItem(models.Model):
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE, related_name="invoices_items")
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="instrument_items")
    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        unique=False,
        blank=True,
        verbose_name=_("invoice instrument information"),
    )

    class Meta:
        verbose_name = "Invoice Instrument Item"
        verbose_name_plural = "Invoices Instrument Items"
        unique_together = ["instrument", "invoice"]


class MediaPack(models.Model):
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="mediapacks",
    )
    alt_text = models.CharField(
        max_length=255,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
    )
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="mediapacks_created",
    )


class Image(models.Model):
    image = models.ImageField(
        max_length=255,
        upload_to=get_store_images_filepath,
        null=False,
        blank=False,
    )
    media_pack = models.ForeignKey(MediaPack, on_delete=models.CASCADE, related_name="images")

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        ordering = ("-media_pack__created_at",)


# @receiver(pre_delete, sender=Invoice)
# def delete_related_items_on_invoice_delete(sender, instance, **kwargs):
#     # instance is the deleted invoice object
#     instance.substances.all().delete()
#     instance.instruments.all().delete()


@receiver(pre_delete, sender=InvoiceInstrumentItem)
def update_instrument_action(sender, instance, **kwargs):
    instance.instrument.in_action = False
    instance.instrument.save()
