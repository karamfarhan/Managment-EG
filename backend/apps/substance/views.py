from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Instrument, InvoiceSubstanceItem, Substance
from .serializers import (
    CategorySerializer,
    InstrumentReadSerializer,
    InstrumentSelectBarSerializer,
    InstrumentWriteSerializer,
    SubstanceReadSerializer,
    SubstanceSelectBarSerializer,
    SubstanceWriteSerializer,
)

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"


class CategoryVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Category.objects.all()
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        serializer_class = CategorySerializer(queryset, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = CategorySerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        substance_category = get_object_or_404(self.queryset, pk=pk)
        operation = substance_category.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


class SubstanceVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Substance.objects.select_related("created_by")
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = Substance.objects.select_related("created_by")
        context = {"request": request}
        serializer_class = SubstanceReadSerializer(queryset, context=context, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        substance = get_object_or_404(self.queryset, pk=pk)
        context = {"request": request}
        serializer_class = SubstanceReadSerializer(substance, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = SubstanceWriteSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            substance = serializer.save(created_by=request.user)
            new_serializer = SubstanceReadSerializer(substance, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_CREATED
            # add_company_data_to_response(company, context)

            return Response(new_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        request.user
        substance = get_object_or_404(self.queryset, pk=pk)

        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context)
        serializer = SubstanceWriteSerializer(substance, data=request.data, partial=True)
        if serializer.is_valid():
            substance = serializer.save()
            new_serializer = SubstanceReadSerializer(substance, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_UPDATE
            # add_company_data_to_response(company, context)
            return Response(new_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        substance = get_object_or_404(self.queryset, pk=pk)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = substance.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


class SubstanceSelectBarView(ListAPIView):
    queryset = Substance.objects.all()
    serializer_class = SubstanceSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)


class InstrumentVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Instrument.objects.select_related("created_by")
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = Instrument.objects.select_related("created_by")
        context = {"request": request}
        serializer_class = InstrumentReadSerializer(queryset, context=context, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        instrument = get_object_or_404(self.queryset, pk=pk)
        context = {"request": request}
        serializer_class = InstrumentReadSerializer(instrument, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = InstrumentWriteSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            instrument = serializer.save(created_by=request.user)
            new_serializer = InstrumentReadSerializer(instrument, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_CREATED
            # add_company_data_to_response(company, context)

            return Response(new_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        request.user
        instrument = get_object_or_404(self.queryset, pk=pk)

        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context)
        serializer = InstrumentWriteSerializer(instrument, data=request.data, partial=True)
        if serializer.is_valid():
            instrument = serializer.save()
            new_serializer = InstrumentReadSerializer(instrument, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_UPDATE
            # add_company_data_to_response(company, context)
            return Response(new_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        substance = get_object_or_404(self.queryset, pk=pk)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = substance.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


class InstrumentSelectBarView(ListAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)
