from apps.account.models import Account

# from core.utils import unique_slug_generator
from django.db import models

# from django.db.models import F
# from django.db.models.signals import post_delete, pre_delete, pre_save
# from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

# from PIL import Image
# from rest_framework import serializers


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
    UNIT_TYPE = (
        ("KG", "kilogram"),
        ("L", "letter"),
        ("T", "ton"),
        ("M", "meter"),
        ("M_2", "square meter"),
        ("M_3", "cubic meter"),
        ("DAHAN", "dahan"),
        ("SH_20", "shakara 20"),
        ("SH_25", "shakara 25"),
        ("SH_50", "shakara 50"),
        ("SH_M", "shakara paste"),
        ("PIECE", "piece"),
    )
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
    unit_type = models.CharField(
        max_length=20,
        choices=UNIT_TYPE,
        verbose_name=_("Unit Type"),
        help_text=(
            """
            Valid choices:

            KG = "kilogram"
            L = "letter"
            T = "ton"
            M = "meter"
            M_2 = "square meter"
            M_3 = "cubic meter"
            DAHAN = "dahan"
            SH_20 = "shakara 20"
            SH_25 = "shakara 25"
            SH_50 = "shakara 50"
            SH_M = "shakara paste"
            PIECE = "piece"
        """
        ),
    )

    class Meta:
        verbose_name = "Substance"
        verbose_name_plural = "Substances"
        ordering = ("-created_at",)

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
        ordering = ("-created_at",)

    def __str__(self):
        return self.name
