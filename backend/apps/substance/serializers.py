from apps.account.models import Account
from django.db import transaction
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
            "last_maintain",
            "maintain_place",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]


class InvoiceSubstanceItemSerializer(serializers.ModelSerializer):
    substance_name = serializers.SerializerMethodField("get_substance_name")
    # substance = serializers.PrimaryKeyRelatedField(queryset=Substance.objects.all(),write_only=True)

    class Meta:
        model = InvoiceSubstanceItem
        fields = ["substance", "substance_name", "mass", "description"]
        read_only_fields = ["substance_name"]

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
    instrument_name = serializers.SerializerMethodField("get_instrument_name")

    class Meta:
        model = InvoiceInstrumentItem
        fields = ["instrument_name", "instrument", "description"]
        read_only_fields = ["instrument_name"]

    def create(self, validated_data):
        instrument = validated_data["instrument"]
        instrument.in_action = True
        instrument.save()
        return super().create(validated_data)

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
        invoice = self.create_invoice(validated_data)
        return invoice

    @transaction.atomic
    def create_invoice(self, validated_data):
        substances = validated_data.pop("substances", [])
        instruments = validated_data.pop("instruments", [])

        invoice = Invoice.objects.create(**validated_data)

        # ! serializer way
        for substance in substances:
            substance["substance"] = substance["substance"].pk
            serializer = InvoiceSubstanceItemSerializer(data=substance)
            serializer.is_valid(raise_exception=True)
            sub = serializer.save()
            invoice.substances.add(sub)
        for instrument in instruments:
            instrument["instrument"] = instrument["instrument"].pk
            serializer = InvoiceInstrumentItemSerializer(data=instrument)
            serializer.is_valid(raise_exception=True)
            ins = serializer.save()
            invoice.instruments.add(ins)
        # ! only create way
        # substance_items_obj = [InvoiceSubstanceItem.objects.create(**substance) for substance in substances]
        # invoice.substances.add(*substance_items_obj)
        # instrument_items_obj = [InvoiceInstrumentItem.objects.create(**instrument) for instrument in instruments]
        # invoice.instruments.add(*instrument_items_obj)
        return invoice
