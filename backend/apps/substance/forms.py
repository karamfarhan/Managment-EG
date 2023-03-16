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


# ! we can use this mutaion class with the form

# mutaion with DjangoModelFormMutation
# class SubstanceMutation(DjangoModelFormMutation):
#     substance = graphene.Field(SubstanceNode)

#     class Meta:
#         return_field_name = "substance"
#         form_class = SubstanceForm
#         model = Substance
