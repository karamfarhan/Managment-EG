import graphene
from apps.store.schema import StoreNode
from graphene import relay
from graphene.relay.mutation import ClientIDMutation
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoFormMutation, DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_file_upload.scalars import Upload
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
    class Input:
        employee_category = EmployeeCategoryEnum()
        identity_image = Upload()
        certificate_image = Upload()
        criminal_record_image = Upload()
        experience_image = Upload()

    identity_image = graphene.String()
    certificate_image = graphene.String()
    experience_image = graphene.String()
    criminal_record_image = graphene.String()
    employee_category = graphene.Field(EmployeeCategoryEnum)

    class Meta:
        serializer_class = EmployeeSerializer
        model_operations = ["create", "update"]
        lookup_field = "id"
        convert_choices_to_enum = False
        exclude_fields = (
            "employee_category",
            "identity_image",
            "certificate_image",
            "criminal_record_image",
            "experience_image",
        )

    # TODO: i need to make a custome resolver for each image filed so that i send the full url
    # def resolve_identity_image(self, info):
    #     """Resolve product image absolute path"""
    #     if self.image:
    #         self.image = info.context.build_absolute_uri(self.image.url)
    #     return self.image


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
