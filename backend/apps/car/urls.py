from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CarActivityViewSet, CarViewSet

urlpatterns = [
    path(
        "cars/<int:id>/activity/",
        CarActivityViewSet.as_view({"get": "list", "post": "create"}),
    ),
]


router = DefaultRouter()
router.register(r"cars", CarViewSet, basename="car")
# router.register(r"stores", StoreViewSet, basename="store")
urlpatterns += (path("", include(router.urls)),)
