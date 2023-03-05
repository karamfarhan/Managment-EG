import django_filters

from .models import Instrument, Substance


class SubstanceFilter(django_filters.FilterSet):
    class Meta:
        model = Substance
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            "category__name": ["iexact", "icontains", "istartswith"],
            "is_available": [
                "exact",
            ],
            "created_at": ["exact", "year__gt", "year__lt"],
            "units": ["exact", "gte", "lte"],
            "unit_type": ["iexact", "icontains", "istartswith"],
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


class InstrumentFilter(django_filters.FilterSet):
    class Meta:
        model = Instrument
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            "category__name": [
                "exact",
            ],
            "in_action": [
                "exact",
            ],
            "is_working": [
                "exact",
            ],
            "created_at": ["exact", "year__gt", "year__lt"],
            "last_maintain": ["exact", "year__gt", "year__lt"],
            "maintain_place": ["iexact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ("name", "name"),
            ("created_at", "created_at"),
            ("last_maintain", "last_maintain"),
            ("maintain_place", "maintain_place"),
        ),
        # labels do not need to retain order
        field_labels={
            "name": "Substance name",
            "created_at": "Substance created Date",
            "last_maintain": "last maintain Date",
            "maintain_place": "maintain place",
        },
    )
