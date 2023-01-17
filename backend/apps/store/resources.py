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


# class InvoiceResource(resources.ModelResource):
#     store = Field()
#     invoice_id = Field()
#     created_by = Field()
#     substances = Field(column_name='substances', attribute='substances', widget=ForeignKeyWidget(InvoiceSubstanceItem, 'substance'))
#     instruments = Field(column_name='instruments', attribute='instruments', widget=ForeignKeyWidget(InvoiceInstrumentItem, 'instrument'))

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
#     def dehydrate_created_by(self, invoice):
#         return str(invoice.created_by.username)


class InvoiceResource(resources.ModelResource):
    store = Field()
    invoice_id = Field()
    created_by = Field()
    substances = Field()
    instruments = Field()

    class Meta:
        model = Invoice
        fields = ("id", "store", "invoice_id", "substances", "instruments", "created_by", "created_at", "note")
        export_order = fields

    def dehydrate_store(self, invoice):
        return str(invoice.store.address)

    def dehydrate_invoice_id(self, invoice):
        return str(invoice.id)

    def dehydrate_created_by(self, invoice):
        return str(invoice.created_by.username)

    def dehydrate_substances(self, invoice):
        substances = self.get_items_data(invoice.substance_items.all(), "sub")
        return str(substances) if len(substances) > 0 else "None"

    def dehydrate_instruments(self, invoice):
        instruments = self.get_items_data(invoice.instrument_items.all(), "ins")
        return str(instruments) if len(instruments) > 0 else "None"

    def get_items_data(self, items, item_type):

        data = []
        if item_type == "sub":
            for item in items:
                data.append(
                    [
                        item.substance.name,
                        getattr(item, "mass", "None"),
                        getattr(item, "description", "None"),
                    ]
                )
        if item_type == "ins":
            for item in items:
                data.append(
                    [
                        item.instrument.name,
                        getattr(item, "description", "None"),
                    ]
                )
        return data
