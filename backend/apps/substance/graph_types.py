import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required

from .filters import InstrumentFilter, SubstanceFilter
from .models import Category, Instrument, Substance


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
        return queryset


class InstrumentNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Instrument
        name = "Instrument"
        filterset_class = InstrumentFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    @permission_required("substance.view_instrument")
    def get_queryset(cls, queryset, info):
        return queryset


class SubstanceSelectBarNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Substance
        filter_fields = {
            "name": ["iexact", "icontains", "istartswith"],
        }
        only_fields = ("name", "pk")
        interfaces = (relay.Node,)


class InstrumentSelectBarNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Instrument
        filter_fields = {
            "name": ["iexact", "icontains", "istartswith"],
        }
        only_fields = ("name", "pk")
        interfaces = (relay.Node,)
