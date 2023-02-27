from django.contrib import admin

from .models import Car, CarActivity, CarActivityRide

admin.site.register(Car)
admin.site.register(CarActivity)
admin.site.register(CarActivityRide)
