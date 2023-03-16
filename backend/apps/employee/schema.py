import graphene
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_file_upload.scalars import Upload

from .graph_types import EmployeeNode, EmployeeSelectBarNode
from .models import Employee, EmployeeActivity, Insurance
from .serializers import EmployeeActivitySerializer, EmployeeSerializer

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

    # TODO: i have to think of way to send the full url of the image to the user,
    # i can do an resolver down, but i alredy did that to the EmployeeNode,maybe i can reuse it by setting the default resolver
    # like this :     identity_image = graphene.Field(graphene.String,resolver=someresolver())
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
    selectbar_employees = DjangoFilterConnectionField(EmployeeSelectBarNode)


# TODO: there is some mutation does not need to return the object after creating it like Account, so i need to check this
