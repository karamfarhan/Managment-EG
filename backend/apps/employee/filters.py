import django_filters

from .models import Employee, EmployeeActivity


class EmployeeFilter(django_filters.FilterSet):
    class Meta:
        model = Employee
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            # "category": ["exact"],
            # "category__name": ["exact"],
            # "units": ["exact", "gte", "lte"],
            # "unit_type": ["exact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ("name", "name"),
            ("created_at", "created_at"),
        ),
        # labels do not need to retain order
        field_labels={
            "name": "Substance name",
            "created_at": "Substance created Date",
        },
    )


class ActivityFilter(django_filters.FilterSet):
    class Meta:
        model = EmployeeActivity
        fields = {
            "date": ["iexact", "icontains", "gte", "lte"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(("date", "date"),),
        # labels do not need to retain order
        field_labels={
            "date": "activity date",
        },
    )
