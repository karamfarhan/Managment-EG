from core.exports import ModelViewSetExportBase
from django.db.models import Prefetch
from django.http import Http404, HttpResponseForbidden, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Employee, EmployeeActivity, Insurance
from .resources import EmployeeActivityResource, EmployeeResource
from .serializers import EmployeeActivitySerializer, EmployeeSerializer


class EmployeeViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Employee.objects.select_related("created_by", "insurance")
    pagination_class = PageNumberPagination
    serializer_class = EmployeeSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "created_by__username",
        "name",
        "number",
        "type",
        "email",
    ]
    ordering_fields = ["name", "created_at", "years_of_experiance"]
    resource_class = EmployeeResource

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeeActivityViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = EmployeeActivity.objects.all()
    pagination_class = PageNumberPagination
    serializer_class = EmployeeActivitySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "date",
    ]
    ordering_fields = ["date"]
    resource_class = EmployeeActivityResource
    # TODO should update the kwargs.get("id") to more effiecent way maybe use the default self.get_objects()

    # def get_serializer_class(self, *args, **kwargs):
    #     if self.request.method in ["PUT","PATCH"]:
    #         return EmployeeActivityUpdateSerializer
    #     return EmployeeActivitySerializer
    def get_queryset(self):
        employee_id = self.kwargs.get("id")
        employee = get_object_or_404(Employee, id=employee_id)
        return self.queryset.filter(employee=employee)

    def create(self, request, *args, **kwargs):
        employee_id = self.kwargs.get("id")
        employee = get_object_or_404(Employee, id=employee_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(employee=employee)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        activity_id = request.data.get("id", None)
        if activity_id is None:
            raise serializers.ValidationError({"id": "This field is required while setting the phase out"})
        instance = get_object_or_404(self.queryset, id=activity_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
