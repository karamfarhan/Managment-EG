from django.http import Http404, HttpResponseForbidden
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Image, Store
from .serializers import ImageSerializer, MediaPackSerializer, StoreSelectBarSerializer, StoreSerializer

SUCCESS_CREATED = "successfully created"
SUCCESS_UPDATE = "successfully updated"
SUCCESS_DELETE = "successfully deleted"

# localhost:8000/api/post/all/?page=3
# localhost:8000/api/post/all/?search=django


class StoreSelectBarView(ListAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class StoreViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Store.objects.select_related("created_by")
    pagination_class = PageNumberPagination
    serializer_class = StoreSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["created_by__username", "name", "address"]  # fields you want to search against
    ordering_fields = ["name", "created_at"]  # fields you want to order by

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ImageViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Image.objects.select_related("media_pack")
    pagination_class = PageNumberPagination
    serializer_class = ImageSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = (
        "media_pack__store__name",
        "media_pack__store__address",
        "media_pack__created_at",
        "media_pack__created_by__username",
    )
    ordering_fields = ("media_pack__created_at",)

    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)
    def get_serializer_class(self):
        if self.action == "create":
            return MediaPackSerializer
        return self.serializer_class

    def retrieve(self, request, *args, **kwargs):
        return HttpResponseForbidden("Retrieving is not allowed.")

    def destroy(self, request, *args, **kwargs):
        return HttpResponseForbidden("Destroy is not allowed.")

    def get_object(self):
        if self.action in ["retrieve", "destroy"]:
            raise Http404("Retrieving/destroy is not allowed.")
        return super().get_object()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT, headers=headers)
