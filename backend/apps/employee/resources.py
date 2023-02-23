from import_export import resources
from import_export.fields import Field

from .models import Employee, EmployeeActivity


class EmployeeResource(resources.ModelResource):
    id = Field(attribute="id", column_name="invoice id")
    store = Field(attribute="store__address", column_name="store address")
    created_by = Field(attribute="created_by__username", column_name="created by")
    is_primary = Field()
    insurance_code = Field(attribute="insurance__ins_code", column_name="insurance code")
    insurance_type = Field(attribute="insurance__ins_type", column_name="insurance type")
    insurance_company = Field(attribute="insurance__ins_company", column_name="insurance company")
    insurance_started_date = Field(attribute="insurance__start_at", column_name="insurance started date")

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
            "employee_category",
            "store",
            "is_primary",
            "note",
            "insurance_code",
            "insurance_type",
            "insurance_company",
            "insurance_started_date",
        )
        export_order = fields

    def dehydrate_is_primary(self, employee):
        if employee.is_primary:
            return "Yes"
        return "No"


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
