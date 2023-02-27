from django.db import transaction
from rest_framework import serializers

from apps.substance.serializers import AccountSerializer

from .models import Image, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, MediaPack, Store


class StoreInvoicesSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "created_by",
            "created_at",
        ]
        read_only_fields = fields


class StoreSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ("address", "pk")
        read_only_fields = fields


class StoreSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField("get_username")
    invoices = serializers.SerializerMethodField("get_invoices")

    class Meta:
        model = Store
        fields = [
            "id",
            "name",
            "created_by",
            "address",
            "description",
            "active_status",
            "start_at",
            "created_at",
            "invoices",
        ]
        read_only_fields = ["id", "created_by", "creatd_at", "invoices"]

    def get_username(self, store):
        return store.created_by.username

    # TODO update the querey after setting the related name in invoice model
    def get_invoices(self, store):
        invoices = store.invoices.all()
        serializer = StoreInvoicesSerializer(invoices, many=True)
        return serializer.data


class InvoiceSubstanceItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("get_substance_name")
    # substance = serializers.PrimaryKeyRelatedField(queryset=Substance.objects.all(),write_only=True)

    class Meta:
        model = InvoiceSubstanceItem
        fields = ["substance", "name", "mass", "description"]
        read_only_fields = ["name"]

    def validate(self, data):
        if data["substance"].units - data["mass"] < 0:
            raise serializers.ValidationError(
                {
                    "mass": f"You don't have ({data['mass']} {data['substance'].unit_type}) Of ({data['substance'].name}) to send it to the store. You only have ({data['substance'].units} {data['substance'].unit_type})"
                }
            )
        return data

    def create(self, validated_data):
        substance = validated_data["substance"]
        substance.units -= validated_data["mass"]
        substance.save()
        return super().create(validated_data)

    def get_substance_name(self, instance):
        return instance.substance.name


class InvoiceInstrumentItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField("get_instrument_name")

    class Meta:
        model = InvoiceInstrumentItem
        fields = ["name", "instrument", "description"]
        read_only_fields = ["name"]

    def create(self, validated_data):
        instrument = validated_data["instrument"]
        instrument.in_action = True
        instrument.save()
        return super().create(validated_data)

    def get_instrument_name(self, instance):
        return instance.instrument.name


class InvoiceSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    store_address = serializers.SerializerMethodField("get_store_address")
    substance_items = InvoiceSubstanceItemSerializer(many=True, read_only=True)
    instrument_items = InvoiceInstrumentItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "note",
            "store_address",
            "substance_items",
            "instrument_items",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "store_address", "substance_items", "instrument_items"]

    def get_store_address(self, invoice):
        return invoice.store.address

    def create(self, validated_data):
        invoice = self.create_invoice(validated_data)
        return invoice

    @transaction.atomic
    def create_invoice(self, validated_data):
        substances = validated_data.pop("substances")
        instruments = validated_data.pop("instruments")

        invoice = Invoice.objects.create(**validated_data)

        # ! serializer way
        for substance in substances:
            # substance["substance"] = substance["substance"].pk
            serializer = InvoiceSubstanceItemSerializer(data=substance)
            serializer.is_valid(raise_exception=True)
            serializer.save(invoice=invoice)
            # sub = serializer.save()
            # invoice.substances.add(sub)
        for instrument in instruments:
            # instrument["instrument"] = instrument["instrument"].pk
            serializer = InvoiceInstrumentItemSerializer(data=instrument)
            serializer.is_valid(raise_exception=True)
            serializer.save(invoice=invoice)
            # ins = serializer.save()
            # invoice.instruments.add(ins)
        # ! only create way
        # substance_items_obj = [InvoiceSubstanceItem.objects.create(**substance) for substance in substances]
        # invoice.substances.add(*substance_items_obj)
        # instrument_items_obj = [InvoiceInstrumentItem.objects.create(**instrument) for instrument in instruments]
        # invoice.instruments.add(*instrument_items_obj)
        return invoice


class MediaPackSerializer(serializers.ModelSerializer):

    images = serializers.ListField(
        write_only=True, child=serializers.FileField(max_length=10000000, allow_empty_file=True, use_url=False)
    )
    store_name = serializers.SerializerMethodField("get_store_name")
    created_by = serializers.SerializerMethodField("get_username")

    class Meta:
        model = MediaPack
        # write_only_fields = ('store',)
        fields = ("store", "alt_text", "created_at", "created_by", "images", "store_name")
        read_only_fields = ["created_by", "creatd_at", "store_name"]

    def create(self, validated_data):
        images = validated_data.pop("images")
        media_pack = MediaPack.objects.create(**validated_data)
        for img in images:
            Image.objects.create(media_pack=media_pack, image=img)
        return media_pack

    def get_store_name(self, mediapack):
        return mediapack.store.address

    def get_username(self, mediapack):
        return mediapack.created_by.username


class ImageSerializer(serializers.ModelSerializer):
    media_pack = MediaPackSerializer()

    class Meta:
        model = Image
        fields = ("id", "image", "media_pack")
        read_only_fields = ("id",)
