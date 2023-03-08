import graphene
from django import forms
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_jwt.decorators import login_required, permission_required

from .filters import InstrumentFilter, SubstanceFilter
from .models import Category, Instrument, Substance
from .serializers import CategorySerializer, InstrumentSerializer, SubstanceSerializer


class CategoryNode(DjangoObjectType):
    class Meta:
        model = Category
        name = "Category"
        filter_fields = ("name",)
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    @permission_required("substance.view_category")
    def get_queryset(cls, queryset, info):
        return queryset


class CategoryMutation(SerializerMutation):
    class Meta:
        serializer_class = CategorySerializer
        model_operations = [
            "create",
        ]
        lookup_field = "name"


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


class SubstanceNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Substance
        name = "Substance"
        filterset_class = SubstanceFilter
        interfaces = (relay.Node,)

    # ! this method is for the single get request when you request by id
    # ! maybe i want the single request to not have permission,or not authenticate
    # @classmethod
    # @login_required
    # def get_node(cls, info, id):
    #     return super(SubstanceNode,cls).get_node(info ,id)

    # ! to customize the query based on the user, and set a permissions for it
    @classmethod
    @login_required
    @permission_required("substance.view_substance")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


# TODO: make substance mutaion to accept setting category relationships
# *: there is a problem with Substance mutaion, it set the category relationship
# *: as a string while it should be a categoryNode or list of id, types, and i dont' know how to change it to what i need
# *: one way is to change the set the category filed on the serializer to serializers.ListField
# *: it will work but, i have to set it write_only=True in order to work,in result it will not return the categories when query for the substance since it's write_only
# *: and also it will not give a good error message when i send wrong category pk


class SubstanceUnitTypeEnum(graphene.Enum):
    class Meta:
        enum = Substance.UnitType


# mutaion with serializerMutaion
class SubstanceMutation(SerializerMutation):
    unit_type = graphene.Field(SubstanceUnitTypeEnum)
    category = graphene.List(graphene.ID)

    class Meta:
        serializer_class = SubstanceSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        convert_choices_to_enum = False
        # ? we have to exlcude the override filds so that our custome fileds can work
        exclude_fields = (
            "unit_type",
            "category",
        )

    class Input:
        unit_type = SubstanceUnitTypeEnum()
        category = graphene.List(graphene.ID)


# mutaion with DjangoModelFormMutation
# class SubstanceMutation(DjangoModelFormMutation):
#     substance = graphene.Field(SubstanceNode)

#     class Meta:
#         return_field_name = "substance"
#         form_class = SubstanceForm
#         model = Substance


class InstrumentNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Instrument
        name = "Instrument"
        filterset_class = InstrumentFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("substance.view_substance")
    def get_queryset(cls, queryset, info):
        return queryset


# mutaion with serializerMutaion
class InstrumentMutation(SerializerMutation):
    category = graphene.List(graphene.ID)

    class Meta:
        serializer_class = InstrumentSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        # ? we have to exlcude the override filds so that our custome fileds can work
        exclude_fields = ("category",)

    class Input:
        category = graphene.List(graphene.ID)


class Mutation(graphene.ObjectType):
    write_substance = SubstanceMutation.Field()
    write_Instrument = InstrumentMutation.Field()
    write_category = CategoryMutation.Field()


class Query(graphene.ObjectType):
    substance = relay.Node.Field(SubstanceNode)
    substances = DjangoFilterConnectionField(SubstanceNode)
    instrument = relay.Node.Field(InstrumentNode)
    instruments = DjangoFilterConnectionField(InstrumentNode)
    categories = DjangoFilterConnectionField(CategoryNode)
