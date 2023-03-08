import graphene
from apps.store.schema import StoreNode
from graphene import relay
from graphene.relay.mutation import ClientIDMutation
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_jwt.decorators import login_required, permission_required

from .filters import EmployeeActivityFilter, EmployeeFilter
from .models import Employee, EmployeeActivity, Insurance
from .serializers import EmployeeActivitySerializer, EmployeeSerializer


class EmployeeActivityNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = EmployeeActivity
        name = "EmployeeActivity"
        filterset_class = EmployeeActivityFilter
        interfaces = (relay.Node,)
        exclude_fields = ("employee",)

    @classmethod
    @login_required
    # @permission_required("employee.view_employeeactivity")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class InsuranceNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Insurance
        name = "Insurance"
        # filterset_class = EmployeeFilter
        interfaces = (relay.Node,)
        exclude_fields = ("employee",)

    @classmethod
    @login_required
    # @permission_required("employee.view_insurance")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


class EmployeeNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Employee
        name = "Employee"
        filterset_class = EmployeeFilter
        interfaces = (relay.Node,)

    @classmethod
    @login_required
    # @permission_required("employee.view_employee")
    def get_queryset(cls, queryset, info):
        # TODO: here i can send only the data that belongs to the user
        return queryset


# ! in the Employee Mutaion, i disabled the employee_category from the original serializer
# ! and create my own Enum that inherit from the model choices and set in as input, also return it
# ! the reason i did that because there is problem with the default enum converter in the SerializerMutation

# TODO: i have to snend a clear validation messages when the insurance id is the same
class EmployeeCategoryEnum(graphene.Enum):
    class Meta:
        enum = Employee.EmployeeCategory


# mutaion with serializerMutaion
class EmployeeMutation(SerializerMutation):
    # store = graphene.Field(StoreNode)
    employee_category = graphene.Field(EmployeeCategoryEnum)

    class Meta:
        serializer_class = EmployeeSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        convert_choices_to_enum = False
        exclude_fields = ("employee_category",)

    class Input:
        employee_category = EmployeeCategoryEnum()


class EmployeeActivityMutation(SerializerMutation):
    class Meta:
        serializer_class = EmployeeActivitySerializer
        model_operations = ["create", "update"]
        lookup_field = "id"


class Mutation(graphene.ObjectType):
    write_employee = EmployeeMutation.Field()
    write_employee_activity = EmployeeActivityMutation.Field()


class Query(graphene.ObjectType):
    employee = relay.Node.Field(EmployeeNode)
    employees = DjangoFilterConnectionField(EmployeeNode)
