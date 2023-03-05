import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_jwt.decorators import login_required, permission_required

from .filters import ImageFilter, InvoiceFilter, StoreFilter
from .models import Image, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, MediaPack, Store


class StoreNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Store
        name = "Store"
        filterset_class = StoreFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class InvoiceNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Invoice
        name = "Invoice"
        filterset_class = InvoiceFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class InvoiceInstrumentItemNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = InvoiceInstrumentItem
        name = "InvoiceInstrumentItem"
        # filterset_class = InvoiceFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class InvoiceSubstanceItemNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = InvoiceSubstanceItem
        name = "InvoiceSubstanceItem"
        # filterset_class = InvoiceFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class ImageNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Image
        name = "Image"
        filterset_class = ImageFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class MediaPackNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = MediaPack
        name = "MediaPack"
        # filterset_class = ImageFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class Mutation(graphene.ObjectType):
    pass


class Query(graphene.ObjectType):
    store = relay.Node.Field(StoreNode)
    stores = DjangoFilterConnectionField(StoreNode)
