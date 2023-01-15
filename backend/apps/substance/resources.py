from import_export import resources
from import_export.fields import Field

from .models import Substance


class SubstanceResource(resources.ModelResource):
    is_available = Field()

    class Meta:
        model = Substance
        fields = ("id", "name", "is_available", "units", "unit_type", "description")
        export_order = ("id", "name", "is_available", "units", "unit_type", "description")

    def dehydrate_is_available(self, obj):
        if obj.is_available:
            return "Yes"
        return "No"
