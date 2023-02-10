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
        # extra_kwargs = {
        #     'store_address': {'method': 'get_store_address'},
        #     'today_activity': {'method': 'get_today_activity'}
        # }

    def create(self, validated_data):
        insurance_data = validated_data.pop("insurance", None)
        employee = Employee(**validated_data)
        self.handle_insurance(employee, insurance_data, validated_data["created_by"])
        # TODO i already mde .save() in the handle_insurance method, should be removed, or removed from here, can't be 2 at same time
        employee.save()
        return employee

    def update(self, instance, validated_data):
        insurance_data = validated_data.pop("insurance", None)
        self.handle_insurance(instance, insurance_data, validated_data["created_by"])
        return super().update(instance, validated_data)

    def get_store_address(self, employee):
        if employee.store:
            return employee.store.address
        return None

    def get_today_activity(self, employee):
        today_activity = employee.activities.filter(date=datetime.datetime.today())
        if today_activity:
            today = today_activity[0]
            serializer = EmployeeActivitySerializer(today)
            return serializer.data
        return False

    def handle_insurance(self, employee, insurance_data, user):
        if insurance_data:
            insurance = employee.insurance
            if insurance:
                serializer = InsuranceSerializer(insurance, data=insurance_data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
            else:
                serializer = InsuranceSerializer(data=insurance_data)
                if serializer.is_valid(raise_exception=True):
                    insruance_obj = serializer.save(created_by=user)
                    employee.insurance = insruance_obj
                    employee.save()


class EmployeeActivitySerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField("get_employee_id")

    class Meta:
        model = EmployeeActivity
        fields = [
            "id",
            "employee",
            "date",
            "phase_in",
            "phase_out",
            "is_holiday",
        ]
        read_only_fields = ["id", "date", "employee"]

    def create(self, validated_data):
        if not validated_data.get("is_holiday", False) and not validated_data.get("phase_in", False):
            raise serializers.ValidationError({"phase_in": "if the holiday is false you should provide phase_in time"})
        try:
            return EmployeeActivity.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"error": "Employee activity for today were already created, can't create again"}
            )

    # ! the problem with validate is it will run on the .create and .update methods
    # ! and i want it to run only on .create method.
    # ? maybe if you check the type of the action before run the check
    # def validate(self, attrs):
    #     if not attrs.get("is_holiday",False) and not attrs.get("phase_in",False):
    #         raise serializers.ValidationError({"phase_in":"if the holiday is false you should provide phase_in time"})
    #     return super().validate(attrs)

    def update(self, instance, validated_data):
        instance.is_holiday = validated_data.get("is_holiday", instance.is_holiday)
        if not instance.phase_out:
            instance.phase_out = validated_data.get("phase_out", instance.phase_out)
            instance.save(update_fields=["phase_out", "is_holiday"])
            return instance
        raise serializers.ValidationError(
            {"phase_out": "Can't update the phase out after it has been set ,(is_holiday filed has been updated)"}
        )

    def get_employee_id(self, instance):
        return instance.employee.id
