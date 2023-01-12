from apps.account.models import Account
from core.utils import unique_slug_generator
from django.db import models
from django.db.models.signals import pre_save

# from apps.substance.models import Substance,Instrument
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from PIL import Image as p_image

from .utils import get_store_images_filepath


class Store(models.Model):
    created_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        related_name="store_account",
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


class MediaPack(models.Model):
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="mediapack_store",
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
        related_name="mediapack_account",
    )


class Image(models.Model):
    image = models.ImageField(
        max_length=255,
        upload_to=get_store_images_filepath,
        null=False,
        blank=False,
    )
    media_pack = models.ForeignKey(MediaPack, on_delete=models.CASCADE, related_name="media_mediapack")

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        ordering = ("-media_pack__created_at",)
