import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required

from .filters import CarActivityFilter, CarFilter
from .models import Car, CarActivity, CarActivityRide


class CarNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Car
        name = "Car"
        filterset_class = CarFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    @permission_required("car.view_car")
    def get_queryset(cls, queryset, info):
        return queryset


class CarActivityNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = CarActivity
        name = "CarActivity"
        filterset_class = CarActivityFilter
        interfaces = (relay.Node,)
        exclude_fields = ("car",)

    @classmethod
    @login_required
    @permission_required("car.view_caractivity")
    def get_queryset(cls, queryset, info):
        return queryset


class CarActivityRideNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = CarActivityRide
        name = "CarActivityRide"
        # filterset_class = EmployeeFilter
        interfaces = (relay.Node,)
        exclude_fields = ("activity",)

    @classmethod
    @login_required
    @permission_required("car.view_caractivity")
    def get_queryset(cls, queryset, info):
        return queryset
