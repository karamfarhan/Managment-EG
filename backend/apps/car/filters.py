import django_filters

from .models import Car, CarActivity


class CarFilter(django_filters.FilterSet):
    class Meta:
        model = Car
        fields = {
            "car_model": ["iexact", "icontains", "istartswith"],
            "car_type": ["iexact", "icontains", "istartswith"],
            "car_number": ["iexact", "icontains", "istartswith"],
            "driver__name": ["iexact", "icontains", "istartswith"],
            "maintain_place": ["iexact", "icontains", "istartswith"],
            "last_maintain": ["exact", "gte", "lte"],
        }

    order_by = django_filters.OrderingFilter(
        fields=(
            ("car_model", "car_model"),
            ("car_type", "car_type"),
            ("created_at", "created_at"),
            ("last_maintain", "last_maintain"),
        ),
        field_labels={
            "car_model": "Car's model name",
            "car_type": "Car's type name",
            "created_at": "Car created Date",
            "last_maintain": "Last maintain date",
        },
    )


class CarActivityFilter(django_filters.FilterSet):
    class Meta:
        model = CarActivity
        fields = {
            "driver": ["iexact", "icontains", "istartswith"],
            "distance": ["exact", "gte", "lte"],
            "activity_date": ["exact", "gte", "lte"],
        }

    order_by = django_filters.OrderingFilter(
        fields=(
            ("activity_date", "activity_date"),
            ("distance", "distance"),
            ("driver", "driver"),
        ),
        field_labels={
            "activity_date": "activity occur date",
            "distance": "activity distance",
            "driver": "activity driver name",
        },
    )
