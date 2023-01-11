from django.db.models import Prefetch
from django.http import Http404, HttpResponseForbidden, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Instrument, Invoice, InvoiceInstrumentItem, InvoiceSubstanceItem, Substance
from .serializers import (
    CategorySerializer,
    InstrumentSelectBarSerializer,
    InstrumentSerializer,
    InvoiceReadSerializer,
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
    ]  # fields you want to search against
    ordering_fields = ["name", "created_at", "units"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SubstanceSelectBarView(ListAPIView):
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
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Invoice.objects.all().prefetch_related(
        Prefetch("substances", queryset=InvoiceSubstanceItem.objects.all()),
        Prefetch("instruments", queryset=InvoiceInstrumentItem.objects.all()),
        Prefetch("instruments__instrument", queryset=Instrument.objects.all()),
        Prefetch("substances__substance", queryset=Substance.objects.all()),
    )
    serializer_class = InvoiceSerializer
    pagination_class = PageNumberPagination
    # filter_backends = [SearchFilter, OrderingFilter]
    # search_fields = ["created_by__username", "name", "category__name", "ins_type"]  # fields you want to search against
    # ordering_fields = ["name", "created_at", "last_maintain"]
    # def get_queryset(self):
    #     return Invoice.objects.all().prefetch_related(Prefetch("substances", queryset=InvoiceSubstanceItem.objects.all()),Prefetch("instruments", queryset=InvoiceInstrumentItem.objects.all()))

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return InvoiceReadSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        substances = request.data.pop("substances")
        instruments = request.data.pop("instruments")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, substances=substances, instruments=instruments)
        headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED, headers=headers)
