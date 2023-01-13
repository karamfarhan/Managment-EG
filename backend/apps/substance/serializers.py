from apps.account.models import Account
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .models import Category, Instrument, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Substance


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "name",
        ]


class SubstanceSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substance
        fields = ("name", "pk")


class SubstanceSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), allow_null=True, required=False
    )
    created_by = AccountSerializer(read_only=True)

    class Meta:
        model = Substance
        fields = [
            "id",
            "name",
            "category",
            "created_by",
            "description",
            "is_available",
            "units",
            "unit_type",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "is_available"]


class InstrumentSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ("name", "pk")
        read_only_fields = fields


class InstrumentSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), allow_null=True, required=False
    )
    created_by = AccountSerializer(read_only=True)

    class Meta:
        model = Instrument
        fields = [
            "id",
            "name",
            "category",
            "created_by",
            "description",
            "is_working",
            "in_action",
            "ins_type",
            "last_maintain",
            "maintain_place",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "in_action"]


class InvoiceSubstanceItemSerializer(serializers.ModelSerializer):
    substance_name = serializers.SerializerMethodField("get_substance_name")
    # substance = serializers.PrimaryKeyRelatedField(queryset=Substance.objects.all(),write_only=True)

    class Meta:
        model = InvoiceSubstanceItem
        fields = ["substance", "substance_name", "mass", "description"]
        read_only_fields = ["substance_name"]

    def get_substance_name(self, instance):
        return instance.substance.name


class InvoiceInstrumentItemSerializer(serializers.ModelSerializer):
    instrument_name = serializers.SerializerMethodField("get_instrument_name")
    # instrument = serializers.PrimaryKeyRelatedField(queryset=Instrument.objects.all(),write_only=True)

    class Meta:
        model = InvoiceInstrumentItem
        fields = ["instrument_name", "instrument", "description"]
        read_only_fields = ["instrument_name"]

    def get_instrument_name(self, instance):
        return instance.instrument.name


class InvoiceSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    substances = InvoiceSubstanceItemSerializer(many=True)
    instruments = InvoiceInstrumentItemSerializer(many=True)
    # TODO should return the store name when read, not the id

    class Meta:
        model = Invoice
        fields = [
            "id",
            "note",
            "store",
            "substances",
            "instruments",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]

    def create(self, validated_data):
        # TODO if there is error in the sub/ins the invoice will be created
        # TODO should set up the method that will sucess when all thing are successed
        # ! there is another way to set up the creating of sub/ins
        # ! which is to call the serializer (.is_vaild,.save) of them and then
        # ! in this way i can write any logic in the .create() method in the serializer
        substances = validated_data.pop("substances")
        instruments = validated_data.pop("instruments")
        invoice = Invoice.objects.create(**validated_data)
        substance_items_obj = [InvoiceSubstanceItem.objects.create(**substance) for substance in substances]
        invoice.substances.add(*substance_items_obj)
        instrument_items_obj = [InvoiceInstrumentItem.objects.create(**instrument) for instrument in instruments]
        invoice.instruments.add(*instrument_items_obj)
        return invoice
