from itertools import chain

from import_export import resources
from import_export.fields import Field
from import_export.widgets import ForeignKeyWidget

from .models import Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Store


class StoreResource(resources.ModelResource):
    active_status = Field()
    invoices_number = Field()

    class Meta:
        model = Store
        fields = (
            "id",
            "name",
            "address",
            "active_status",
            "start_at",
            "invoices_number",
            "description",
        )
        export_order = fields

    def dehydrate_active_status(self, store):
        if store.active_status:
            return "Yes"
        return "No"

    def dehydrate_invoices_number(self, store):
        return store.invoices.all().count()


# class InvoiceResource(resources.ModelResource):
#     id = Field(attribute="id",column_name="invoice id")
#     store = Field(attribute="store__address",column_name="store address")
#     created_by = Field(attribute="created_by__username", column_name="created_by")
#     substance = Field()
#     instrument = Field()
#     mass = Field()
#     description = Field()


#     class Meta:
#         model = Invoice
#         fields = ("id", "substance", "instrument", "mass", "description", "store", "created_by", "created_at", "note")
#         export_order = fields

#     def dehydrate_substance(self, invoice):
#         data = self.get_item_data(invoice, "substance")
#         return str(data)

#     def dehydrate_instrument(self, invoice):
#         data = self.get_item_data(invoice, "instrument")
#         return str(data)

#     def dehydrate_mass(self, invoice):
#         data = self.get_item_data(invoice, "mass")
#         return str(data)

#     def dehydrate_description(self, invoice):
#         data = self.get_item_data(invoice, "description")
#         return str(data)


#     def get_item_data(self, invoice, key):
#         substances = invoice.substance_items.all()
#         instruments = invoice.instrument_items.all()
#         items = list(chain(substances,instruments))
#         current = items.pop()
#         return getattr(current, key ,"None")


## from chatGPT but  it didn't work
# class InvoiceSubstanceItemInline(resources.TabularInline):
#     model = InvoiceSubstanceItem
#     fields = (
#         "substance",
#         "mass",
#         "description",
#     )

# class InvoiceInstrumentItemInline(resources.TabularInline):
#     model = InvoiceInstrumentItem
#     fields = (
#         "instrument",
#         "description",
#     )


# class InvoiceResource(resources.ModelResource):
#     store = Field()
#     invoice_id = Field()
#     substances = InvoiceSubstanceItemInline()
#     instruments = InvoiceInstrumentItemInline()
#     class Meta:
#         model = Invoice
#         fields = (
#             "id",
#             "store",
#             "invoice_id",
#             "substances",
#             "instruments",
#             "created_by",
#             "created_at",
#             "note"

#         )
#         export_order = fields

#     def dehydrate_store(self, invoice):
#         return str(invoice.store.address)

#     def dehydrate_invoice_id(self, invoice):
#         return str(invoice.id)


# ## this return the the invoice items as string list
class InvoiceResource(resources.ModelResource):
    id = Field(attribute="id", column_name="invoice id")
    store = Field(attribute="store__address", column_name="store address")
    created_by = Field(attribute="created_by__username", column_name="created_by")
    substances = Field()
    instruments = Field()

    class Meta:
        model = Invoice
        fields = ("id", "store", "substances", "instruments", "created_by", "created_at", "note")
        export_order = fields

    def dehydrate_substances(self, invoice):
        substances = self.get_items_data(invoice.substance_items.all())
        return str(substances)

    def dehydrate_instruments(self, invoice):
        instruments = self.get_items_data(invoice.instrument_items.all())
        return str(instruments)

    def get_items_data(self, items):
        data = []
        for item in items:
            item_list = []
            if hasattr(item, "substance"):
                item_list.extend([item.substance.name, getattr(item, "mass", "None")])
            elif hasattr(item, "instrument"):
                item_list.extend([item.instrument.name])
            item_list.append(getattr(item, "description", "None"))
            data.append(item_list)
        return data
