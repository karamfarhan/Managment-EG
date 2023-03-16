import graphene
from graphene import relay
from graphene_django import DjangoObjectType
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
    @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        return queryset


class InvoiceNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Invoice
        name = "Invoice"
        filterset_class = InvoiceFilter
        interfaces = (relay.Node,)
        exclude_fields = ("store",)

    @classmethod
    @login_required
    @permission_required("store.view_invoice")
    def get_queryset(cls, queryset, info):
        return queryset


class InvoiceInstrumentItemNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = InvoiceInstrumentItem
        name = "InvoiceInstrumentItem"
        # filterset_class = InvoiceFilter
        interfaces = (relay.Node,)
        exclude_fields = ("invoice",)

    @classmethod
    @login_required
    # ! i puted the "view_invoice" on the InvoiceinstrumentItem permissions because,if you have the invoice
    # ! permission you will also have the permission for the items.
    # ? but you can change it and give it the permission (store.view_invoiceinstrumentitem) and it will not show the instruemtns
    # ? items unless the user have the permission for them also, on top of having the "view_invoice" permission
    @permission_required("store.view_invoice")
    def get_queryset(cls, queryset, info):
        return queryset


class InvoiceSubstanceItemNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = InvoiceSubstanceItem
        name = "InvoiceSubstanceItem"
        # filterset_class = InvoiceFilter
        interfaces = (relay.Node,)
        exclude_fields = ("invoice",)

    @classmethod
    @login_required
    @permission_required("store.view_invoice")
    def get_queryset(cls, queryset, info):
        return queryset


class ImageNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Image
        name = "Image"
        filterset_class = ImageFilter
        interfaces = (relay.Node,)
        exclude_fields = ("media_pack",)

    def resolve_image(self, info):
        """Resolve product image absolute path"""
        if self.image:
            self.image = info.context.build_absolute_uri(self.image.url)
        return self.image

    @classmethod
    @login_required
    @permission_required("store.view_mediapack")
    def get_queryset(cls, queryset, info):
        return queryset


class MediaPackNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = MediaPack
        name = "MediaPack"
        # filterset_class = ImageFilter
        interfaces = (relay.Node,)
        exclude_fields = ("store",)

    @classmethod
    @login_required
    @permission_required("store.view_mediapack")
    def get_queryset(cls, queryset, info):
        return queryset
