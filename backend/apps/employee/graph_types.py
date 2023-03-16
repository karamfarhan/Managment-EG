import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required

from .filters import EmployeeActivityFilter, EmployeeFilter
from .models import Employee, EmployeeActivity, Insurance


class EmployeeNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Employee
        name = "Employee"
        filterset_class = EmployeeFilter
        interfaces = (relay.Node,)

    def resolve_identity_image(self, info):
        if self.identity_image:
            self.identity_image = info.context.build_absolute_uri(self.identity_image.url)
        return self.identity_image

    def resolve_certificate_image(self, info):
        if self.certificate_image:
            self.certificate_image = info.context.build_absolute_uri(self.certificate_image.url)
        return self.certificate_image

    def resolve_experience_image(self, info):
        if self.experience_image:
            self.experience_image = info.context.build_absolute_uri(self.experience_image.url)
        return self.experience_image

    def resolve_criminal_record_image(self, info):
        if self.criminal_record_image:
            self.criminal_record_image = info.context.build_absolute_uri(self.criminal_record_image.url)
        return self.criminal_record_image

    @classmethod
    @login_required
    @permission_required("employee.view_employee")
    def get_queryset(cls, queryset, info):
        return queryset


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
    @permission_required("employee.view_employeeactivity")
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
    @permission_required("employee.view_insurance")
    def get_queryset(cls, queryset, info):
        return queryset


class EmployeeSelectBarNode(DjangoObjectType):
    pk = graphene.ID(source="pk")

    class Meta:
        model = Employee
        filter_fields = {
            "name": ["iexact", "icontains", "istartswith"],
        }
        only_fields = ("name", "pk")
        interfaces = (relay.Node,)
