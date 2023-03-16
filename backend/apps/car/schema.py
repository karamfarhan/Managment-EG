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


# TODO: when i send a wrong id as a driver id to create car, it fail to create a car
# but it should raise an error
class CarMutation(SerializerMutation):
    class Input:
        driver = graphene.ID(required=False)

    driver = graphene.Field(EmployeeNode)
    driver_name_from_mutaion = graphene.String()

    class Meta:
        serializer_class = CarSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        exclude_fields = ("driver",)

    """
    the reason why i am overwriting the driver resolver becuase i am using serializermutaion
    and if you goes to the Car mutaion it's actually returning the (id) of the driver
    not the driver objects, because i didn't alter the seriazlier driver filed to be objects i
    left it to be pk related, that's why, if i delete the new resolver it will show me error
    says that it the driver resolver recived a pk, but it should recive an (EmployeeNode) boject,why is that?
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

    # ? here is example on how to send new custome data fileds to the client after creating the object,
    # ? (it will be read only, like the custome fileds in serizlizers)
    def resolve_driver_name_from_mutaion(self, info, **kwargs):
        if self.driver:
            self.driver_name_from_mutaion = self.driver.name
        else:
            self.driver_name_from_mutaion = None
        return self.driver_name_from_mutaion


class CarRidesInput(graphene.InputObjectType):
    place_from = graphene.String(required=True)
    place_to = graphene.String(required=True)


# TODO: should fix this problem in custome mutaion class, it should be like SerializerMutaion
"""
the problem is when i create a custome mutaion class, it's not like when i use
SerializerMutaion from graphene,
graphene will return the fileds of the objects, so i can access them after the creation
but in custome class i have to return the objects itself, and then access it's filed from the object

in SerializerMutaion will be like this:

mutaion...
    ...
    ...
    filed_1
    filed_2

but in custome class:

mutaion...
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
                # ! maybe the if statment on .is_valid() is not required
                # ! i can make it like the ModelViewSet (look at it)
                if serializer.is_valid(raise_exception=True):
                    ride_obj = serializer.save(activity=car_activity)
                    ride_obj.save()

        return cls(errors=None, car_activity=car_activity)


class Mutation(graphene.ObjectType):
    write_car = CarMutation.Field()
    write_activity_car = CarActivityMutation.Field()


class Query(graphene.ObjectType):
    car = relay.Node.Field(CarNode)
    cars = DjangoFilterConnectionField(CarNode)
