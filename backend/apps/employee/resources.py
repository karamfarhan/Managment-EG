from import_export import resources
from import_export.fields import Field

from .models import Employee, EmployeeActivity


class EmployeeResource(resources.ModelResource):
    store = Field()
    is_primary = Field()
    insurance_code = Field()
    insurance_type = Field()
    insurance_company = Field()
    insurance_started_date = Field()

    class Meta:
        model = Employee
        fields = (
            "id",
            "name",
            "type",
            "email",
            "number",
            "years_of_experiance",
            "days_off",
            "signin_date",
            "store",
            "is_primary",
            "note",
            "insurance_code",
            "insurance_type",
            "insurance_company",
            "insurance_started_date",
        )
        export_order = fields

    def dehydrate_store(self, employee):
        if employee.store:
            return str(employee.store.address)
        return "None"

    def dehydrate_is_primary(self, employee):
        if employee.is_primary:
            return "Yes"
        return "No"

    def dehydrate_insurance_code(self, employee):
        if employee.insurance:
            return str(employee.insurance.ins_code)
        return "None"

    def dehydrate_insurance_type(self, employee):
        if employee.insurance:
            return str(employee.insurance.ins_type)
        return "None"

    def dehydrate_insurance_company(self, employee):
        if employee.insurance:
            return str(employee.insurance.ins_company)
        return "None"

    def dehydrate_insurance_started_date(self, employee):
        if employee.insurance:
            return str(employee.insurance.start_at)
        return "None"


class EmployeeActivityResource(resources.ModelResource):
    is_holiday = Field()

    class Meta:
        model = EmployeeActivity
        fields = (
            "date",
            "phase_in",
            "phase_out",
            "is_holiday",
        )
        export_order = fields

    def dehydrate_is_holiday(self, employee):
        if employee.is_holiday:
            return "Yes"
        return "No"
