import datetime

from core.exports import ModelViewSetExportBase
from django.shortcuts import get_object_or_404

# from ipware.ip import get_client_ip
from rest_framework import serializers, status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Employee, EmployeeActivity
from .resources import EmployeeActivityResource, EmployeeResource
from .serializers import EmployeeActivitySerializer, EmployeeSelectBarSerializer, EmployeeSerializer

# import geoip2
# from django_ip_geolocation.decorators import with_ip_geolocation


class EmployeeViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)
    queryset = Employee.objects.select_related("created_by", "insurance")
    pagination_class = PageNumberPagination
    serializer_class = EmployeeSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["created_by__username", "name", "number", "type", "email", "store__address", "employee_category"]
    ordering_fields = ["name", "created_at", "years_of_experiance"]
    resource_class = EmployeeResource

    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_superuser:
    #         return Employee.objects.select_related("created_by", "insurance")
    #     else:
    #         return Employee.objects.filter(account=user)

    def create(self, request, *args, **kwargs):
        print(f"Employee-{self.request.method}-REQUEST_DATA = ", request.data)
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid()
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print(f"Employee-{self.request.method}-REQUEST_DATA = ", request.data)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, context={"request": request}, partial=True)
        serializer.is_valid()
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeeSelectBarView(ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSelectBarSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class EmployeeActivityViewSet(ModelViewSetExportBase, viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated,)
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

    def get_queryset(self):
        employee_id = self.kwargs.get("id")
        employee = get_object_or_404(Employee, id=employee_id)
        return self.queryset.filter(employee=employee)

    # ! this decorator will add the location of the user in the request object
    # @with_ip_geolocation
    def create(self, request, *args, **kwargs):
        print(f"Employee Activity-{self.request.method}-REQUEST_DATA = ", request.data)

        # ip, is_routable = get_client_ip(request)
        # TODO this method doesn't work i have to find a way to convert the ip to location
        # if ip is not None:
        #     location_data = geoip2.geolite2.lookup(ip)
        #     print(location_data.location.latitude, location_data.location.longitude)

        employee_id = self.kwargs.get("id")
        employee = get_object_or_404(Employee, id=employee_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(employee=employee)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print(f"Employee Activity-{self.request.method}-REQUEST_DATA = ", request.data)
        activity_id = request.data.get("id", None)
        if activity_id is None:
            raise serializers.ValidationError({"id": "This field is required while setting the phase out"})
        # TODO should search the activity based on the date also, for more secure
        # TODO because now he can send the id and update an activity from the last month
        instance = get_object_or_404(self.queryset, id=activity_id, date=datetime.datetime.today())
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_client_ip(self, request):
        ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip is None:
            ip = request.META.get("REMOTE_ADDR")
        return ip


# TODO i think you can use the action decorator in the export method instead to
# TODO determine the url for the method instead of setting it in the url file
# class MyViewSet(viewsets.ViewSet):
# @action(methods=['get'], detail=False, url_path='my-view', suffix='custom')
# @with_ip_geolocation
# def my_view(self, request):
#     location_data = request.ip_geolocation
#     print(location_data)
