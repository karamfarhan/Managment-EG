import django_filters

from .models import Substance


class SubstanceFilter(django_filters.FilterSet):
    class Meta:
        model = Substance
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            "category": ["exact"],
            "category__name": ["exact"],
            "units": ["exact", "gte", "lte"],
            "unit_type": ["exact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ("name", "name"),
            ("created_at", "created_at"),
            ("units", "units"),
        ),
        # labels do not need to retain order
        field_labels={
            "name": "Substance name",
            "created_at": "Substance created Date",
            "units": "Substance unit size",
        },
    )
