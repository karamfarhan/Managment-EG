from apps.account.models import Account
from rest_framework import serializers

from .models import Category, Instrument, Substance


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


#         read_only_fields = fields


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
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "in_action"]
