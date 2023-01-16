from django.db.models import Prefetch
from django.http import Http404, HttpResponse, HttpResponseForbidden, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Instrument, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Substance
from .resources import SubstanceResource
from .serializers import (
    CategorySerializer,
    InstrumentSelectBarSerializer,
    InstrumentSerializer,
    InvoiceSerializer,
    SubstanceSelectBarSerializer,
    SubstanceSerializer,
)

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
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


class SubstanceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
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
    # resource_class = SubstanceResource
    # actions = ['export_to_excel']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def export(self, request, *args, **kwargs):
        qs = self.get_queryset()
        dataset = SubstanceResource().export(qs)
        file_format = self.kwargs.get("file_format")

        if file_format == "xls":
            ds = dataset.xls
        elif file_format == "csv":
            ds = dataset.csv
        elif file_format == "json":
            ds = dataset.json
        response = HttpResponse(ds, content_type=f"{file_format}")
        response["Content-Disposition"] = f"attachment: filename=substance.{file_format}"
        return response


class SubstanceSelectBarView(ListAPIView):
    # TODO should update the quere to get the fields i need not all fields->(id,name)
    queryset = Substance.objects.all()
    serializer_class = SubstanceSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class InstrumentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Instrument.objects.select_related("created_by")
    pagination_class = PageNumberPagination
    serializer_class = InstrumentSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["created_by__username", "name", "category__name", "ins_type"]  # fields you want to search against
    ordering_fields = ["name", "created_at", "last_maintain"]

    def create(self, request, *args, **kwargs):
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


class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    # TODO the quere should be optimized
    queryset = Invoice.objects.all().prefetch_related(
        Prefetch("substances", queryset=InvoiceSubstanceItem.objects.all()),
        Prefetch("instruments", queryset=InvoiceInstrumentItem.objects.all()),
    )
    serializer_class = InvoiceSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "created_at",
    ]
    ordering_fields = [
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        invoice = self.get_object()
        invoice.substances.all().delete()
        invoice.instruments.all().delete()
        return super().destroy(request, *args, **kwargs)
