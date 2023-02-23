from django.db.models import Prefetch
from django.http import Http404, HttpResponseForbidden, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response

from core.exports import ModelViewSetExportBase

from .models import Car, CarActivity, CarActivityRide
from .resources import CarActivityResource, CarResource

# from .resources import EmployeeActivityResource, EmployeeResource
from .serializers import CarActivitySerializer, CarSerializer


class CarViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    queryset = Car.objects.select_related("created_by", "driver")
    pagination_class = PageNumberPagination
    serializer_class = CarSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["created_by__username", "car_model", "car_type", "car_number", "driver__name", "maintain_place"]
    ordering_fields = ["car_model", "created_at", "last_maintain"]
    resource_class = CarResource

    # def get_queryset(self):
    #     if self.request.user.is_superuser:
    #         return Car.objects.select_related("created_by", "driver")
    #     return Car.objects.select_related("created_by", "driver").filter(driver=self.request.user.employee)

    def create(self, request, *args, **kwargs):
        print(f"Car-{self.request.method}-REQUEST_DATA = ", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CarActivityViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)
    queryset = CarActivity.objects.select_related("created_by")
    pagination_class = PageNumberPagination
    serializer_class = CarActivitySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["car__model", "car__number", "driver", "activity_date"]
    ordering_fields = ["activity_date", "distance"]
    resource_class = CarActivityResource

    def get_queryset(self):
        car_id = self.kwargs.get("id")
        car = get_object_or_404(Car, id=car_id)
        return self.queryset.filter(car=car)

    def create(self, request, *args, **kwargs):
        print(f"Car Activity-{self.request.method}-REQUEST_DATA = ", request.data)
        car_id = self.kwargs.get("id")
        car = get_object_or_404(Car, id=car_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, car=car)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
