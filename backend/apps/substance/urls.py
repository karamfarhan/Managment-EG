from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .models import Substance
from .views import (
    CategoryViewSet,
    InstrumentSelectBarView,
    InstrumentViewSet,
    InvoiceViewSet,
    SubstanceSelectBarView,
    SubstanceViewSet,
)

urlpatterns = [
    path("export/substances/", SubstanceViewSet.as_view({"get": "export"}), name="substances-export"),
    path("export/instruments/", InstrumentViewSet.as_view({"get": "export"}), name="instruments-export"),
    path("substances/select_list/", SubstanceSelectBarView.as_view(), name="substance_select"),
    path("instruments/select_list/", InstrumentSelectBarView.as_view(), name="insturment_select"),
]

router = DefaultRouter()
router.register(r"substances", SubstanceViewSet, basename="substance")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"instruments", InstrumentViewSet, basename="instrument")
router.register(r"invoices", InvoiceViewSet, basename="invoice")
urlpatterns += (path("", include(router.urls)),)
