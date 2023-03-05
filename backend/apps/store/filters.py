import django_filters

from .models import Image, Invoice, Store


class StoreFilter(django_filters.FilterSet):
    class Meta:
        model = Store
        fields = {
            "name": ["iexact", "icontains", "istartswith"],
            "address": ["iexact", "icontains", "istartswith"],
            "active_status": [
                "exact",
            ],
            "created_at": ["exact", "year__gt", "year__le"],
            # "maintain_place": ["iexact", "icontains", "istartswith"],
            # "car_counter": ["exact", "gte", "lte"],
            # "unit_type": ["exact", "icontains", "istartswith"],
        }

    order_by = django_filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("name", "name"),
        ),
        field_labels={
            "created_at": "invoice date",
        },
    )


class InvoiceFilter(django_filters.FilterSet):
    class Meta:
        model = Invoice
        fields = {
            "note": ["iexact", "icontains", "istartswith"],
            # "substance_items__name": ["iexact", "icontains", "istartswith"],
            # "instrument_items__name": ["iexact", "icontains", "istartswith"],
            "created_at": ["exact", "year__gt", "year__lt"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(("created_at", "created_at"),),
        # labels do not need to retain order
        field_labels={
            "created_at": "invoice date",
        },
    )


class ImageFilter(django_filters.FilterSet):
    class Meta:
        model = Image
        fields = {
            # "media_pack__store__address": ["iexact", "icontains", "istartswith"],
            "media_pack__created_at": ["exact", "year__gt", "year__lt"],
        }

    order_by = django_filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(("media_pack__created_at", "media_pack__created_at"),),
        # labels do not need to retain order
        field_labels={
            "media_pack__created_at": "image creation date",
        },
    )
