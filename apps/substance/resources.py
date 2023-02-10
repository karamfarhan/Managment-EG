from import_export import resources
from import_export.fields import Field

from .models import Instrument, Substance


class SubstanceResource(resources.ModelResource):
    is_available = Field()

    class Meta:
        model = Substance
        fields = ("id", "name", "is_available", "units", "unit_type", "description")
        export_order = fields

    def dehydrate_is_available(self, substance):
        if substance.is_available:
            return "Yes"
        return "No"


class InstrumentResource(resources.ModelResource):
    in_action = Field()
    is_working = Field()

    class Meta:
        model = Instrument
        fields = ("id", "name", "in_action", "is_working", "last_maintain", "maintain_place", "description")
        export_order = fields

    def dehydrate_in_action(self, instrument):
        if instrument.in_action:
            return "Yes"
        return "No"

    def dehydrate_is_working(self, instrument):
        if instrument.is_working:
            return "Yes"
        return "No"
