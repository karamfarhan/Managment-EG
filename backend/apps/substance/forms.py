from django import forms

from ..substance.models import Substance


class SubstanceForm(forms.ModelForm):
    class Meta:
        model = Substance
        fields = [
            "id",
            "name",
            "category",
            "description",
            "units",
            "unit_type",
        ]
