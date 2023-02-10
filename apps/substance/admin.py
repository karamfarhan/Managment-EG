from django.contrib import admin

# Register your models here.
from .models import Category, Instrument, Substance

admin.site.register(Substance)
admin.site.register(Instrument)
admin.site.register(Category)
