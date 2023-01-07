from apps.account.serializers import AccountRedSerializer
from rest_framework import serializers

from .models import Instrument, Substance, SubstanceCategory


class SubstanceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubstanceCategory
        fields = [
            "id",
            "name",
        ]
        read_only_fields = ["id"]


class SubstanceReadSerializer(serializers.ModelSerializer):
    category = SubstanceCategorySerializer(read_only=True)
    created_by = AccountRedSerializer(read_only=True)

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
            "units_type",
            "created_at",
        ]
        read_only_fields = fields


class SubstanceSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substance
        fields = ("name", "pk")
        read_only_fields = fields


class SubstanceWriteSerializer(serializers.ModelSerializer):
    # category = serializers.RelatedField(queryset=Substance.objects.all())
    class Meta:
        model = Substance
        fields = ["name", "category", "description", "is_available", "untis", "units_type"]

    def create(self, validated_data):
        try:
            substance = Substance.objects.create(**validated_data)
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return substance

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.category = validated_data.get("category", instance.category)
        instance.is_available = validated_data.get("is_available", instance.is_available)
        instance.untis = validated_data.get("units", instance.units)
        instance.units_type = validated_data.get("units_type", instance.units_type)
        instance.save()
        return instance


class InstrumentReadSerializer(serializers.ModelSerializer):
    created_by = AccountRedSerializer(read_only=True)

    class Meta:
        model = Instrument
        fields = [
            "id",
            "name",
            "in_action",
            "is_working",
            "description",
            "type",
            "last_maintain",
            "created_at",
            "created_by",
        ]
        read_only_fields = fields


class InstrumentSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ("name", "pk")
        read_only_fields = fields


class InstrumentWriteSerializer(serializers.ModelSerializer):
    # category = serializers.RelatedField(queryset=Substance.objects.all())
    class Meta:
        model = Instrument
        fields = ["name", "in_action", "is_working", "description", "type", "last_maintain"]

    def create(self, validated_data):
        try:
            instrument = Instrument.objects.create(**validated_data)
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return instrument

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.in_action = validated_data.get("in_action", instance.in_action)
        instance.is_working = validated_data.get("is_working", instance.is_working)
        instance.type = validated_data.get("type", instance.type)
        instance.last_maintain = validated_data.get("last_maintain", instance.last_maintain)
        instance.save()
        return instance
