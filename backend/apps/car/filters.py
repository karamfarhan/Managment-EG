import django_filters

from .models import Car, CarActivity


class CarFilter(django_filters.FilterSet):
    class Meta:
        model = Car
        fields = {
            "car_model": ["iexact", "icontains", "istartswith"],
            "car_type": ["iexact", "icontains", "istartswith"],
            "driver__name": ["iexact", "icontains", "istartswith"],
            "maintain_place": ["iexact", "icontains", "istartswith"],
            # "car_counter": ["exact", "gte", "lte"],
            # "unit_type": ["exact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(("name", "name"), ("created_at", "created_at"), ("last_maintain", "last_maintain")),
        # labels do not need to retain order
        field_labels={
            "name": "Substance name",
            "created_at": "Substance created Date",
            "last_maintain": "Last maintain date",
        },
    )


class CarActivityFilter(django_filters.FilterSet):
    class Meta:
        model = CarActivity
        fields = {
            # "car__car_model": ["iexact", "icontains", "istartswith"],
            # "car_type": ["iexact", "icontains", "istartswith"],
            "driver": ["iexact", "icontains", "istartswith"],
            # "maintain_place": ["iexact", "icontains", "istartswith"],
            "distance": ["exact", "gte", "lte"],
            "activity_date": ["exact", "gte", "lte"],
            # "unit_type": ["exact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ("activity_date", "activity_date"),
            ("distance", "distance"),
        ),
        # labels do not need to retain order
        field_labels={
            "activity_date": "activity occur date",
            "distance": "activity distance",
        },
    )
