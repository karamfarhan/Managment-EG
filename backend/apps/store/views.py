from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Image, MediaPack, Store
from .serializers import (
    ImageSerializer,
    MediaPackReadSerializer,
    MediaPackWriteSerializer,
    StoreReadSerializer,
    StoreSelectBarSerializer,
    StoreWriteSerializer,
)

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

    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)


class StoreVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Store.objects.select_related("created_by")
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        # queryset = Store.objects.filter(owner=request.user)
        context = {"request": request}
        serializer_class = StoreReadSerializer(self.queryset, context=context, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        company = get_object_or_404(self.queryset, pk=pk)
        context = {"request": request}
        serializer_class = StoreReadSerializer(company, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = StoreWriteSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            company = serializer.save(created_by=request.user)
            new_serializer = StoreReadSerializer(company, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_CREATED
            # add_company_data_to_response(company, context)

            return Response(new_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        request.user
        company = get_object_or_404(self.queryset, pk=pk)

        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context)
        serializer = StoreWriteSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            company = serializer.save()
            new_serializer = StoreReadSerializer(company, context={"request": request})
            # context["response"] = "ok"
            # context["response_message"] = SUCCESS_UPDATE
            # add_company_data_to_response(company, context)
            return Response(new_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        company = get_object_or_404(self.queryset, pk=pk)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = company.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


# localhost:8000/api/post/all/?page=3
# localhost:8000/api/post/all/?search=django
class ImageListPagination(ListAPIView):
    queryset = Image.objects.select_related("media_pack")
    serializer_class = ImageSerializer
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (JWTAuthentication,) # if you make it in settings you don't have to make it here
    # pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = (
        "store__address",
        "created_at",
        "created_by__username",
    )
    ordering_fields = ("created_at",)

    # def get_queryset(self):
    #     return self.queryset.filter(company__owner=self.request.user)


class ImageVewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Image.objects.select_related("media_pack")
    # TRY THIS AND ENABLE get_queryset func MAYBE IT WILL BE BETTER
    # def get_queryset(self):
    #     return self.queryset.filter(owner=self.request.user)

    # def list(self, request, *args, **kwargs):
    #     # queryset = Store.objects.filter(owner=request.user)
    #     context = {"request": request}
    #     serializer_class = StoreReadSerializer(self.queryset, context=context, many=True)
    #     return Response(serializer_class.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        image = get_object_or_404(self.queryset, pk=pk)
        context = {"request": request}
        serializer_class = ImageSerializer(image, context=context)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        response_data = {}
        try:
            store_pk = request.data.get("store")
            store = Store.objects.get(pk=store_pk)
        except Store.DoesNotExist:
            response_data["message"] = "there is no store with this name"
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        serializer = MediaPackWriteSerializer(data=request.data)
        # images = request.FILES.getlist("images")
        if serializer.is_valid():
            serializer.save(created_by=request.user, store=store)
            # for img in images:
            #     Image.objects.create(media_pack=media_pack, image=img)
            response_data["message"] = SUCCESS_CREATED
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def update(self, request, *args, **kwargs):
    #     pk = kwargs.get("pk")
    #     user = request.user
    #     company = get_object_or_404(self.queryset, pk=pk)

    #     # if company.owner != user:
    #     #     context["response"] = "error"
    #     #     context["response_message"] = "you don't have permission."
    #     #     return Response(context)
    #     serializer = StoreWriteSerializer(company, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         company = serializer.save()
    #         new_serializer = StoreReadSerializer(company, context={"request": request})
    #         # context["response"] = "ok"
    #         # context["response_message"] = SUCCESS_UPDATE
    #         # add_company_data_to_response(company, context)
    #         return Response(new_serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        context = {}
        pk = kwargs.get("pk")
        request.user
        image = get_object_or_404(self.queryset, pk=pk)
        # if company.owner != user:
        #     context["response"] = "error"
        #     context["response_message"] = "you don't have permission."
        #     return Response(context, status=status.HTTP_400_BAD_REQUEST)
        operation = image.delete()
        if operation:
            context["response"] = "ok"
            context["response_message"] = SUCCESS_DELETE
            return Response(context, status=status.HTTP_200_OK)
        else:
            context["response"] = "error"
            context["response_message"] = "delete failed"
            return Response(context, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# @permission_classes([])
# @authentication_classes([])
# def MediaView(request):
#     response_data={}
#     if request.method == "POST":
#         try:
#             store_pk = request.data["store_pk"]
#             store = Store.objects.get(pk=store_pk)
#         except Store.DoesNotExist:
#             response_data["message"] = "there is no store with this name"
#             return Response(response_data, status=status.HTTP_404_NOT_FOUND)

#         serializer = MediaPackReadSerializer(data=request.data)
#         files = request.FILES.getlist("images")
#         if serializer.is_valid():
#             media_pack = serializer.save(created_by=request.user,store=store)
#             for img in files:
#                 Image.objects.create(media_pack=media_pack, image=img)
#             response_data["message"] = SUCCESS_CREATED
#             return  Response(response_data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
