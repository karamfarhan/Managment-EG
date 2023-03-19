import graphene
from django.db import transaction
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_django.types import ErrorType

from ..employee.models import Employee
from ..employee.schema import EmployeeNode
from .graph_types import CarActivityNode, CarNode
from .models import Car, CarActivity
from .serializers import CarActivityRideSerializer, CarSerializer


class CarMutation(SerializerMutation):
    class Input:
        driver = graphene.ID(required=False)

    driver = graphene.Field(EmployeeNode)
    driver_name_from_mutation = graphene.String()

    class Meta:
        serializer_class = CarSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        exclude_fields = ("driver",)

    """
    the reason why i am overwriting the driver resolver because i am using serializer mutation
    and if you goes to the Car mutation it's actually returning the (id) of the driver
    not the driver objects, because i didn't alter the serializer driver filed to be objects i
    left it to be pk related, that's why, if i delete the new resolver it will show me error
    says that it the driver resolver received a pk, but it should receive an (EmployeeNode) object,why is that?
    because if see under the input class i specified that the driver filed should returned as EmployeeNode object
    """

    def resolve_driver(self, info, **kwargs):
        if self.driver:
            try:
                self.driver = Employee.objects.get(id=self.driver.pk)
            except Employee.DoesNotExist:
                self.driver = None
        else:
            self.driver = None
        return self.driver

    # ? here is example on how to send new custom data filed to the client after creating the object,
    # ?, (it will be read only, like the custom filed in serializers)
    def resolve_driver_name_from_mutation(self, info, **kwargs):
        if self.driver:
            self.driver_name_from_mutation = self.driver.name
        else:
            self.driver_name_from_mutation = None
        return self.driver_name_from_mutation


class CarRidesInput(graphene.InputObjectType):
    place_from = graphene.String(required=True)
    place_to = graphene.String(required=True)


# TODO: should fix this problem in custom mutation class, it should be like SerializerMutation
"""
the problem is when i create a custom mutation class, it's not like when i use
SerializerMutation from graphene,
graphene will return the fields of the objects, so i can access them after the creation
but in custom class i have to return the objects itself, and then access it's filed from the object

in SerializerMutation will be like this:

mutation...
    ...
    ...
    filed_1
    filed_2

but in custom class:

mutation...
    ...
    ...
    obj_returned_name{
        filed_1
        filed_3
    }
"""


class CarActivityMutation(relay.ClientIDMutation):
    class Input:
        description = graphene.String(required=False)
        distance = graphene.Int(required=False)
        car = graphene.ID(required=True)
        activity_date = graphene.Date(required=True)
        rides = graphene.InputField(graphene.List(CarRidesInput))

    errors = graphene.List(ErrorType, description="May contain more than one error for same field.")
    car_activity = graphene.Field(CarActivityNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        errors = {}
        if not Car.objects.filter(id=input.get("car")).exists():
            errors["car"] = [f"Car matching query with this id({input.get('car')}) does not exist."]

        if errors:
            errors = ErrorType.from_errors(errors)

            return cls(errors=errors)
        else:
            return cls.perform_mutate(info, input)

    @classmethod
    @transaction.atomic
    def perform_mutate(cls, info, input):
        car = Car.objects.get(id=input.get("car"))
        request = info.context
        rides = input.pop("rides", [])
        car_activity = CarActivity.objects.create(
            created_by=request.user,
            car=car,
            description=input.get("description"),
            distance=input.get("distance"),
            activity_date=input.get("activity_date"),
        )
        if rides:
            for ride in rides:
                serializer = CarActivityRideSerializer(data=ride)
                # ! maybe the if statement on .is_valid() is not required
                # ! I can make it like the ModelViewSet (look at it)
                if serializer.is_valid(raise_exception=True):
                    ride_obj = serializer.save(activity=car_activity)
                    ride_obj.save()

        return cls(errors=None, car_activity=car_activity)


class Mutation(graphene.ObjectType):
    write_car = CarMutation.Field()
    write_activity_car = CarActivityMutation.Field()


# TODO: i have to know what is the best when using relay, to but the permission on the type itself,
#  (by overwriting the get_query method)
# or i have to overwrite the default relay resolver for the query and put an permission on it


class Query(graphene.ObjectType):
    car = relay.Node.Field(CarNode)
    cars = DjangoFilterConnectionField(CarNode)
