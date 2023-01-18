import datetime

from apps.account.models import Account
from apps.store.serializers import StoreSelectBarSerializer
from apps.substance.serializers import AccountSerializer
from django.db import IntegrityError, transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .models import Employee, EmployeeActivity, Insurance


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


class EmployeeSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ("name", "pk")
        read_only_fields = fields


class EmployeeSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    insurance = InsuranceSerializer(allow_null=True, required=False)
    store_address = serializers.SerializerMethodField("get_store_address")
    today_activity = serializers.SerializerMethodField("get_today_activity")
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
            "signin_date",
            "store",
            "store_address",
            "note",
            "is_primary",
            "today_activity",
            "insurance",
            "created_at",
            "created_by",
        ]
        read_only_fields = ["id", "created_by", "created_at", "email_verified", "store_address", "today_activity"]

    def create(self, validated_data):
        employee = self.create_employee(validated_data)
        return employee

    def get_today_activity(self, employee):
        today_activity = employee.activities.filter(date=datetime.datetime.today())
        if today_activity:
            today = today_activity[0]
            serializer = EmployeeActivitySerializer(today)
            print(serializer.data)
            return serializer.data
        print("false")
        return False
        # serializer = StoreInvoicesSerializer(invoices, many=True)
        # return today_activity.

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
                insruance_obj = serializer.save(created_by=validated_data["created_by"])
                employee.insurance = insruance_obj
        employee.save()
        return employee

    @transaction.atomic
    def update_employee(self, instance, validated_data):
        print("update insurance start")
        # TODO i think you should move the updation of the insurance to the end
        insurance_data = validated_data.pop("insurance", None)
        if insurance_data:
            insurance = instance.insurance
            if insurance:
                serializer = InsuranceSerializer(insurance, data=insurance_data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
            else:
                serializer = InsuranceSerializer(data=insurance_data)
                # ! maybe the if statment on .is_valid() is not required
                # ! i can make it like the ModelViewSet (look at it)
                if serializer.is_valid(raise_exception=True):
                    insruance_obj = serializer.save(created_by=validated_data["created_by"])
                    instance.insurance = insruance_obj
                    instance.save()
        print("update insurance finished")
        print("update employee start")
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
        instance.signin_date = validated_data.get("signin_date", instance.signin_date)
        instance.store = validated_data.get("store", instance.store)
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
                "signin_date",
                "store",
                "is_primary",
            ]
        )
        print("update employee finish")
        return instance

    def get_store_address(self, employee):
        if employee.store:
            return employee.store.address
        return None


class EmployeeActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeActivity
        fields = [
            "id",
            "date",
            "phase_in",
            "phase_out",
            "is_holiday",
        ]
        read_only_fields = ["id", "date"]

    def create(self, validated_data):
        try:
            return EmployeeActivity.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"error": "Employee activity for today were already created, can't create again"}
            )

    def update(self, instance, validated_data):
        instance.is_holiday = validated_data.get("is_holiday", instance.is_holiday)
        if not instance.phase_out:
            instance.phase_out = validated_data.get("phase_out", instance.phase_out)
            instance.save(update_fields=["phase_out", "is_holiday"])
            return instance
        raise serializers.ValidationError(
            {"phase_out": "Can't update the phase out after it has been set ,(is_holiday filed has been updated)"}
        )
