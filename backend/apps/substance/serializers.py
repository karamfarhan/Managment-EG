from apps.account.models import Account
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
        fields = ["sub", "substance_name", "mass", "description"]
        read_only_fields = ["substance_name"]

    def get_substance_name(self, instance):
        return instance.sub.name


class InvoiceInstrumentItemSerializer(serializers.ModelSerializer):
    instrument_name = serializers.SerializerMethodField("get_instrument_name")
    # instrument = serializers.PrimaryKeyRelatedField(queryset=Instrument.objects.all(),write_only=True)

    class Meta:
        model = InvoiceInstrumentItem
        fields = ["instrument_name", "ins", "description"]
        read_only_fields = ["instrument_name"]

    def get_instrument_name(self, instance):
        return instance.ins.name


class InvoiceSerializer(serializers.ModelSerializer):
    # substances_data = InvoiceSubstanceItemSerializer(many=True)
    # instruments_data = InvoiceInstrumentItemSerializer(many=True)
    class Meta:
        model = Invoice
        fields = [
            "note",
            "store",
            # "substances_data",
            # "instruments_data",
        ]

    def create(self, validated_data):
        substances_data = validated_data.pop("substances_data")
        instruments_data = validated_data.pop("instruments_data")
        try:
            invoice = Invoice.objects.create(**validated_data)
            for substance_data in substances_data:
                sub = get_object_or_404(Substance, id=substance_data.pop("sub"))
                # InvoiceSubstanceItem.objects.create(invoice=invoice, substance=sub, **substance_data)
                invoice.substances_data.add(sub, through_defaults=substance_data)
            for instrument_data in instruments_data:
                ins = get_object_or_404(Instrument, id=instrument_data.pop("ins"))
                # InvoiceInstrumentItem.objects.create(invoice=invoice, instrument=ins, **instrument_data)
                invoice.instruments_data.add(ins, through_defaults=instrument_data)

            return invoice
        except ValueError:
            invoice.delete()
            raise serializers.ValidationError({"error": "Invalid substances / instruments data was sent"})


class InvoiceReadSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    substances_data = InvoiceSubstanceItemSerializer(many=True)
    instruments_data = InvoiceInstrumentItemSerializer(many=True)
    store = serializers.SerializerMethodField("get_store_name")

    class Meta:
        model = Invoice
        fields = [
            "id",
            "created_at",
            "note",
            "store",
            "substances_data",
            "instruments_data",
            "created_by",
        ]
        read_only_fields = fields

    def get_store_name(self, instance):
        return instance.store.name
