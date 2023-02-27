from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CarActivityViewSet, CarViewSet

urlpatterns = [
    path(
        "cars/<int:id>/activity/",
        CarActivityViewSet.as_view({"get": "list", "post": "create"}),
    ),
    path("export/cars/", CarViewSet.as_view({"get": "export"}), name="export-cars"),
    path("export/cars/<int:id>/activity/", CarActivityViewSet.as_view({"get": "export"}), name="export-caractivity"),
]


router = DefaultRouter()
router.register(r"cars", CarViewSet, basename="car")
# router.register(r"stores", StoreViewSet, basename="store")
urlpatterns += (path("", include(router.urls)),)
