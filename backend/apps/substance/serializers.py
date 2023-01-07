from apps.account.serializers import AccountRedSerializer
from rest_framework import serializers

from .models import Category, Instrument, Substance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            # "id",
            "name",
        ]
        # read_only_fields = ["id"]

    def create(self, validated_data):
        try:
            substance_category = Category.objects.create(**validated_data)
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return substance_category


class SubstanceReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
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
            "unit_type",
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
        fields = ["name", "category", "description", "units", "unit_type"]

    def create(self, validated_data):
        category = validated_data.pop("category")
        try:
            substance = Substance.objects.create(**validated_data)
            substance.category.set(category)
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return substance

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.units = validated_data.get("units", instance.units)
        instance.unit_type = validated_data.get("unit_type", instance.unit_type)
        instance.category.set(validated_data.get("category"))
        instance.save()
        return instance


class InstrumentReadSerializer(serializers.ModelSerializer):
    created_by = AccountRedSerializer(read_only=True)
    category = CategorySerializer(read_only=True, many=True)

    class Meta:
        model = Instrument
        fields = [
            "id",
            "name",
            "in_action",
            "is_working",
            "category",
            "description",
            "ins_type",
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
        fields = ["name", "in_action", "is_working", "category", "description", "ins_type", "last_maintain"]

    def create(self, validated_data):
        category = validated_data.pop("category")
        try:
            instrument = Instrument.objects.create(**validated_data)
            instrument.category.set(category)
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return instrument

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.in_action = validated_data.get("in_action", instance.in_action)
        instance.is_working = validated_data.get("is_working", instance.is_working)
        instance.ins_type = validated_data.get("ins_type", instance.ins_type)
        instance.last_maintain = validated_data.get("last_maintain", instance.last_maintain)
        instance.category.set(validated_data.get("category"))
        instance.save()
        return instance
