from apps.account.models import Account
from apps.store.serializers import StoreSelectBarSerializer
from apps.substance.serializers import AccountSerializer
from django.db import IntegrityError, transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import serializers

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
            "note",
            "driver",
            "driver_name",
            "created_at",
            "last_maintain",
            "maintain_place",
            "created_by",
        ]
        read_only_fields = ["id", "created_by", "created_at", "email_verified"]

    def get_driver_name(self, car_activity):
        return car_activity.driver.name


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
    driver_name = serializers.SerializerMethodField("get_driver_name")

    class Meta:
        model = CarActivity
        fields = [
            "id",
            "driver",
            "driver_name",
            "description",
            "activity_date",
            "distance",
            "rides",
            "created_by",
        ]
        read_only_fields = ["id", "driver_name"]

    def create(self, validated_data):
        car_activity = self.create_car_activity(validated_data)
        return car_activity

    @transaction.atomic
    def create_car_activity(self, validated_data):
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

    def get_driver_name(self, car_activity):
        return car_activity.driver.name
