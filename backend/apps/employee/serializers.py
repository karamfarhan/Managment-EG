from apps.account.models import Account
from apps.substance.serializers import AccountSerializer
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .models import Employee, Insurance


class InsuranceSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    # TODO should return the store name when read, not the id

    class Meta:
        model = Insurance
        fields = [
            "id",
            "ins_code",
            "ins_type",
            "ins_company",
            "start_at",
            "created_at",
            "created_by",
        ]
        read_only_fields = ["id", "created_by", "created_at"]


class EmployeeSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    insurance = InsuranceSerializer()
    # TODO should return the store name when read, not the id

    class Meta:
        model = Employee
        fields = [
            "id",
            "name",
            "type",
            "email",
            "email_verified",
            "number",
            "certificate_image",
            "experience_image",
            "identity_image",
            "criminal_record_image",
            "years_of_experiance",
            "days_off",
            "note",
            "is_primary",
            "insurance",
            "created_at",
            "created_by",
        ]
        read_only_fields = ["id", "created_by", "created_at", "email_verified"]

    def create(self, validated_data):
        employee = self.create_employee(validated_data)
        return employee

    def update(self, instance, validated_data):
        print(validated_data)
        employee = self.update_employee(instance, validated_data)
        return employee

    @transaction.atomic
    def create_employee(self, validated_data):
        insurance_data = validated_data.pop("insurance", None)
        employee = Employee(**validated_data)
        if insurance_data:
            serializer = InsuranceSerializer(data=insurance_data)
            # ! maybe the if statment on .is_valid() is not required
            # ! i can make it like the ModelViewSet (look at it)
            if serializer.is_valid(raise_exception=True):
                insruance_obj = serializer.save(created_by=employee.created_by)
                employee.insurance = insruance_obj
        employee.save()
        return employee

    @transaction.atomic
    def update_employee(self, instance, validated_data):
        insurance_data = validated_data.pop("insurance", None)
        if insurance_data:
            insurance = instance.insurance
            serializer = InsuranceSerializer(insurance, data=insurance_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("type", instance.type)
        instance.email = validated_data.get("email", instance.email).lower()
        instance.number = validated_data.get("number", instance.number)
        instance.certificate_image = validated_data.get("certificate_image", instance.certificate_image)
        instance.experience_image = validated_data.get("experience_image", instance.experience_image)
        instance.identity_image = validated_data.get("identity_image", instance.identity_image)
        instance.criminal_record_image = validated_data.get("criminal_record_image", instance.criminal_record_image)
        instance.years_of_experiance = validated_data.get("years_of_experiance", instance.years_of_experiance)
        instance.days_off = validated_data.get("days_off", instance.days_off)
        instance.note = validated_data.get("note", instance.note)
        instance.is_primary = validated_data.get("is_primary", instance.is_primary)
        instance.save(
            update_fields=[
                "name",
                "type",
                "email",
                "number",
                "certificate_image",
                "experience_image",
                "identity_image",
                "criminal_record_image",
                "years_of_experiance",
                "days_off",
                "note",
                "is_primary",
            ]
        )
        return instance
