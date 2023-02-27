import copy

from core.exports import ModelViewSetExportBase

# from django.db.models import Prefetch
from django.http import Http404, HttpResponseNotAllowed

# from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets

# from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework.response import Response

from .models import Category, Instrument, Substance
from .resources import InstrumentResource, SubstanceResource
from .serializers import (
    CategorySerializer,
    InstrumentSelectBarSerializer,
    InstrumentSerializer,
    SubstanceSelectBarSerializer,
    SubstanceSerializer,
)

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


class CustomDjangoModelPermission(DjangoModelPermissions):
    def __init__(self):
        self.perms_map = copy.deepcopy(self.perms_map)  # from EunChong's answer
        self.perms_map["GET"] = ["%(app_label)s.view_%(model_name)s"]


class CategoryViewSet(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)
    queryset = Category.objects.all()
    pagination_class = None
    serializer_class = CategorySerializer

    def get_actions(self):
        actions = super().get_actions()
        del actions["update"]
        del actions["retrieve"]
        return actions

    def update(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(["GET"], "Updating is not allowed")

    def retrieve(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(["GET"], "Retrieving is not allowed")

    # This method is not required i think :)
    def get_object(self):
        if self.action in ["retrieve", "update"]:
            raise Http404("Retrieving/Updating is not allowed.")
        return super().get_object()


class SubstanceViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    # permission_classes = (CustomDjangoModelPermission,)
    queryset = Substance.objects.select_related("created_by")
    pagination_class = PageNumberPagination
    serializer_class = SubstanceSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "created_by__username",
        "name",
        "category__name",
        "units",
        "unit_type",
    ]
    ordering_fields = ["name", "created_at", "units"]
    resource_class = SubstanceResource

    def create(self, request, *args, **kwargs):
        print(f"Substance-{self.request.method}-REQUEST_DATA = ", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SubstanceSelectBarView(ListAPIView):
    # TODO should update the quere to get the fields i need not all fields->(id,name)
    queryset = Substance.objects.all()
    serializer_class = SubstanceSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class InstrumentViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    # permission_classes = (DjangoModelPermissions,)
    queryset = Instrument.objects.select_related("created_by")
    pagination_class = PageNumberPagination
    serializer_class = InstrumentSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["created_by__username", "name", "category__name"]  # fields you want to search against
    ordering_fields = ["name", "created_at", "last_maintain"]
    resource_class = InstrumentResource

    def create(self, request, *args, **kwargs):
        print(f"Instrument-{self.request.method}-REQUEST_DATA = ", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class InstrumentSelectBarView(ListAPIView):
    #  TODO should update the quere to get the fields i need not all fields->(id,name)
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None
