from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    InstrumentSelectBarView,
    InstrumentVewSet,
    SubstanceCategoryVewSet,
    SubstanceSelectBarView,
    SubstanceVewSet,
)

urlpatterns = [
    # path("substances/categories/", SubstanceCategoryVewSet.as_view(), name="substance_category"),
    path("substances/select_list/", SubstanceSelectBarView.as_view(), name="substance_select"),
    path("substances/select_list/", InstrumentSelectBarView.as_view(), name="insturment_select"),
]
router = DefaultRouter()
router.register(r"substances", SubstanceVewSet, basename="substance")
router.register(r"substances/categories/", SubstanceCategoryVewSet, basename="substance_category")
router.register(r"instruments", InstrumentVewSet, basename="instrument")
urlpatterns += (path("", include(router.urls)),)
