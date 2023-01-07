from django.contrib import admin

# Register your models here.
from .models import Category, Instrument, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Substance

admin.site.register(Substance)
admin.site.register(Instrument)
admin.site.register(Invoice)
admin.site.register(Category)
admin.site.register(InvoiceInstrumentItem)
admin.site.register(InvoiceSubstanceItem)
