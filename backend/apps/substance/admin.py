from django.contrib import admin

# Register your models here.
from .models import Instrument, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Substance, SubstanceCategory

admin.site.register(Substance)
admin.site.register(Instrument)
admin.site.register(Invoice)
admin.site.register(SubstanceCategory)
admin.site.register(InvoiceInstrumentItem)
admin.site.register(InvoiceSubstanceItem)
