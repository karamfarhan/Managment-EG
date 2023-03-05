import django_filters

from .models import Employee, EmployeeActivity


class EmployeeFilter(django_filters.FilterSet):
    class Meta:
        model = Employee
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            "type": ["iexact", "icontains", "istartswith"],
            "email": ["iexact", "icontains", "istartswith"],
            "email_verified": [
                "iexact",
            ],
            "number": ["iexact", "icontains", "istartswith"],
            "employee_category": ["iexact", "icontains", "istartswith"],
            "insurance__ins_code": ["iexact", "icontains", "istartswith"],
            "insurance__ins_type": ["iexact", "icontains", "istartswith"],
            "insurance__ins_company": ["iexact", "icontains", "istartswith"],
            "store__name": ["iexact", "icontains", "istartswith"],
            "is_primary": [
                "iexact",
            ],
            "years_of_experiance": ["exact", "gte", "lte"],
            "days_off": ["exact", "gte", "lte"],
            "signin_date": ["exact", "year__gt", "year__le"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ("name", "name"),
            ("created_at", "created_at"),
            ("employee_category", "employee_category"),
            ("years_of_experiance", "years_of_experiance"),
            ("days_off", "days_off"),
            ("signin_date", "signin_date"),
            ("store__name", "store__name"),
        ),
        # labels do not need to retain order
        field_labels={
            "name": "Substance name",
            "created_at": "Substance created Date",
        },
    )


class EmployeeActivityFilter(django_filters.FilterSet):
    class Meta:
        model = EmployeeActivity
        fields = {
            "date": [
                "exact",
                "contains",
                "year_gt",
                "year_lt",
            ],
            "phase_in": [
                "exact",
                "contains",
                "gte",
                "lte",
            ],
            "phase_out": [
                "exact",
                "contains",
                "gte",
                "lte",
            ],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(("date", "date"),),
        # labels do not need to retain order
        field_labels={
            "date": "activity date",
        },
    )
