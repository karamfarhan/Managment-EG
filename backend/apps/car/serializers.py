from apps.substance.serializers import AccountSerializer
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from ..employee.models import Employee
from ..employee.serializers import EmployeeSerializer
from .models import Car, CarActivity, CarActivityRide


class CarSerializer(serializers.ModelSerializer):
    created_by = AccountSerializer(read_only=True)
    driver_name = serializers.SerializerMethodField("get_driver_name")

    class Meta:
        model = Car
        fields = [
            "id",
            "car_model",
            "car_type",
            "car_number",
            "car_counter",
            "note",
            "driver",
            "driver_name",
            "created_at",
            "last_maintain",
            "maintain_place",
            "created_by",
        ]
        read_only_fields = ["id", "created_by", "created_at", "driver_name"]

    # ! the problem here
    def get_driver_name(self, car):
        if car.driver:
            return car.driver.name
        return None

    # def validate(self,data):
    #     try:
    #         driver_obj = get_object_or_404(Employee,id=data.get('driver'))
    #     except Employee.DoesNotExist:
    #         raise serializers.ValidationError({"driver": [f"there is no driver with this id ({data.get('driver')})"]})
    #     return driver_obj
    # TODO make sure that he can't update the driver to null, should alwaays be a valid driver
    #  (questionable, maybe we don't need the condition)

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data.get("driver")
        # ? make sure if you need this condition on the REST api,
        # if not driver:
        #     raise serializers.ValidationError({"driver": ["no driver with this id"]})

        validated_data["created_by"] = request.user
        # return Car.objects.create(**validated_data)
        return super().create(validated_data)


class CarActivityRideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarActivityRide
        fields = [
            "id",
            "place_from",
            "place_to",
        ]
        read_only_fields = ["id"]


class CarActivitySerializer(serializers.ModelSerializer):
    rides = CarActivityRideSerializer(many=True, allow_null=True, required=False)
    created_by = AccountSerializer(read_only=True)
    # driver_name = serializers.SerializerMethodField("get_driver_name")

    class Meta:
        model = CarActivity
        fields = [
            "id",
            "driver",
            # "driver_name",
            "description",
            "activity_date",
            "distance",
            "rides",
            "created_by",
        ]
        read_only_fields = ["id", "driver"]

    def create(self, validated_data):
        car_activity = self.create_car_activity(validated_data)
        return car_activity

    # TODO maybe if i make the driver for the activity==the car driver at the time of
    # TODO creating the activity, i can make it to be a char filed,
    @transaction.atomic
    def create_car_activity(self, validated_data):
        request = self.context.get("request")
        validated_data["created_by"] = request.user
        rides = validated_data.pop("rides", [])
        car_activity = CarActivity.objects.create(**validated_data)
        if rides:
            for ride in rides:
                serializer = CarActivityRideSerializer(data=ride)
                # ! maybe the if statment on .is_valid() is not required
                # ! i can make it like the ModelViewSet (look at it)
                if serializer.is_valid(raise_exception=True):
                    ride_obj = serializer.save(activity=car_activity)
                    ride_obj.save()
        return car_activity

    # def get_driver_name(self, car_activity):
    #     return car_activity.driver.name
