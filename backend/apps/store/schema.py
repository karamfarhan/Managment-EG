import graphene
from apps.store.serializers import InvoiceInstrumentItemSerializer, InvoiceSubstanceItemSerializer
from django.db import transaction
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_django.types import ErrorType
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required, permission_required

from .filters import ImageFilter, InvoiceFilter, StoreFilter
from .models import Image, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, MediaPack, Store
from .serializers import InvoiceSerializer, MediaPackSerializer, StoreSerializer


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
        exclude_fields = ("store",)

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
        exclude_fields = ("invoice",)

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
        exclude_fields = ("invoice",)

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
        exclude_fields = ("media_pack",)

    def resolve_image(self, info):
        """Resolve product image absolute path"""
        if self.image:
            self.image = info.context.build_absolute_uri(self.image.url)
        return self.image

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
        exclude_fields = ("store",)

    @classmethod
    @login_required
    # @permission_required("store.view_store")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class StoreMutation(SerializerMutation):
    class Meta:
        serializer_class = StoreSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        # exclude_fields = ("invoices",)


class SubstanceItemInput(graphene.InputObjectType):
    substance = graphene.ID(required=True)
    mass = graphene.Int(required=True)
    description = graphene.String(required=False)


class InstrumentItemInput(graphene.InputObjectType):
    instrument = graphene.ID(required=True)
    description = graphene.String(required=False)


class InvoiceMutation(relay.ClientIDMutation):
    class Input:
        note = graphene.String(required=False)
        store = graphene.ID(required=True)
        substance_items = graphene.InputField(graphene.List(SubstanceItemInput))
        instrument_items = graphene.InputField(graphene.List(InstrumentItemInput))

    errors = graphene.List(ErrorType, description="May contain more than one error for same field.")
    invoice = graphene.Field(InvoiceNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        errors = {}
        if not Store.objects.filter(id=input.get("store")).exists():
            errors["store"] = [f"Store matching query with this id({input.get('store')}) does not exist."]

        if errors:
            errors = ErrorType.from_errors(errors)

            return cls(errors=errors)
        else:
            return cls.perform_mutate(info, input)

    @classmethod
    @transaction.atomic
    def perform_mutate(cls, info, input):
        store = Store.objects.get(id=input.get("store"))
        request = info.context
        invoice = Invoice.objects.create(created_by=request.user, store=store, note=input.get("note"))

        for substance in input.get("substance_items"):
            serializer = InvoiceSubstanceItemSerializer(data=substance)
            serializer.is_valid(raise_exception=True)
            serializer.save(invoice=invoice)
        for instrument in input.get("instrument_items"):
            serializer = InvoiceInstrumentItemSerializer(data=instrument)
            serializer.is_valid(raise_exception=True)
            serializer.save(invoice=invoice)

        return cls(errors=None, invoice=invoice)


class StoreImageMutaion(relay.ClientIDMutation):
    class Input:
        images = graphene.List(Upload)
        store = graphene.ID(required=True)
        alt_text = graphene.String()

    errors = graphene.List(ErrorType, description="May contain more than one error for same field.")
    media_pack = graphene.Field(MediaPackNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        errors = {}
        if not Store.objects.filter(id=input.get("store")).exists():
            errors["store"] = [f"Store matching query with this id({input.get('store')}) does not exist."]

        if errors:
            errors = ErrorType.from_errors(errors)

            return cls(errors=errors)
        else:
            return cls.perform_mutate(info, input)

    @classmethod
    @transaction.atomic
    def perform_mutate(cls, info, input):
        store = Store.objects.get(id=input.get("store"))
        request = info.context

        images = input.pop("images")
        media_pack = MediaPack.objects.create(created_by=request.user, store=store, alt_text=input.get("alt_text"))
        for img in images:
            Image.objects.create(media_pack=media_pack, image=img)

        return cls(errors=None, media_pack=media_pack)


class Mutation(graphene.ObjectType):
    write_store = StoreMutation.Field()
    write_invoice = InvoiceMutation.Field()
    upload_store_images = StoreImageMutaion.Field()


class Query(graphene.ObjectType):
    store = relay.Node.Field(StoreNode)
    stores = DjangoFilterConnectionField(StoreNode)
