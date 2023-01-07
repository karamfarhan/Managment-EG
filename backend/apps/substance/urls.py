from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryVewSet, InstrumentSelectBarView, InstrumentVewSet, SubstanceSelectBarView, SubstanceVewSet

urlpatterns = [
    # path(r"substances/categories/", SubstanceCategoryVewSet.as_view({'get': 'list','post': 'create', 'delete': 'destroy'}), name="substance_category"),
    path("substances/select_list/", SubstanceSelectBarView.as_view(), name="substance_select"),
    path("instruments/select_list/", InstrumentSelectBarView.as_view(), name="insturment_select"),
]
router = DefaultRouter()
router.register(r"substances", SubstanceVewSet, basename="substance")
router.register(r"categories", CategoryVewSet, basename="category")
router.register(r"instruments", InstrumentVewSet, basename="instrument")
urlpatterns += (path("", include(router.urls)),)
