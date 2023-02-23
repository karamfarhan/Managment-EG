from django.db import models
from django.db.models.signals import post_delete, pre_delete, pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from apps.employee.models import Employee


class Car(models.Model):
    car_model = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("car model"),
    )
    car_type = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("car type"),
    )
    car_number = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("car number"),
    )
    car_counter = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("car counter"),
    )
    created_by = models.ForeignKey(
        "account.Account",
        on_delete=models.SET_NULL,
        null=True,
        related_name="cars_created",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    driver = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="cars")

    note = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("car note"),
    )
    last_maintain = models.DateField(
        verbose_name=_("last maintain at"), help_text=_("format: Y-m-d H:M:S"), null=True, blank=True
    )
    maintain_place = models.CharField(max_length=250, null=True, blank=True, verbose_name=_("place of fixing the car"))

    class Meta:
        verbose_name = "Car"
        verbose_name_plural = "Cars"
        ordering = ("-created_at",)

    def __str__(self):
        return self.car_number


class CarActivity(models.Model):
    created_by = models.ForeignKey(
        "account.Account",
        on_delete=models.SET_NULL,
        null=True,
        related_name="caractivities_created",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        verbose_name=_("creatred at"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    driver = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("the driver"),
    )
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=False, blank=False, related_name="activities")

    description = models.TextField(
        default="No description",
        max_length=500,
        null=True,
        blank=True,
        verbose_name=_("Car activity note"),
    )
    activity_date = models.DateField(
        verbose_name=_("activity date"),
        help_text=_("format: Y-m-d H:M:S"),
    )
    distance = models.IntegerField(null=False, blank=False, verbose_name=_("the car distance"))

    class Meta:
        verbose_name = "Car Activity"
        verbose_name_plural = "Cars Activity"
        ordering = ("-activity_date",)

    def __str__(self):
        return f"{self.driver}-{self.car}-{self.activity_date}"

    def save(self, *args, **kwargs):
        self.driver = self.car.driver.name
        return super().save(*args, **kwargs)


class CarActivityRide(models.Model):
    place_from = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("ride from-place"),
    )
    place_to = models.CharField(
        max_length=250,
        null=True,
        blank=True,
        verbose_name=_("ride to-place"),
    )
    activity = models.ForeignKey(CarActivity, on_delete=models.CASCADE, null=False, blank=False, related_name="rides")
