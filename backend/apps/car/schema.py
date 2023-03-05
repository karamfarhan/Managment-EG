import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
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
    # @permission_required("car.view_car")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class CarActivityNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = CarActivity
        name = "CarActivity"
        filterset_class = CarActivityFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("car.view_car_car_activity")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class CarActivityRideNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = CarActivityRide
        name = "CarActivityRide"
        # filterset_class = EmployeeFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("car.view_car")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class Mutation(graphene.ObjectType):
    pass


class Query(graphene.ObjectType):
    car = relay.Node.Field(CarNode)
    cars = DjangoFilterConnectionField(CarNode)
