import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required

from .filters import EmployeeActivityFilter, EmployeeFilter
from .models import Employee, EmployeeActivity, Insurance


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
