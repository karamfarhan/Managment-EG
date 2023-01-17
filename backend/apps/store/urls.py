from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ImageViewSet, StoreSelectBarView, StoreViewSet

urlpatterns = [
    path("stores/select_list/", StoreSelectBarView.as_view(), name="stores_select_list"),
]


router = DefaultRouter()
router.register(r"stores", StoreViewSet, basename="store")
router.register(r"images", ImageViewSet, basename="image")
urlpatterns += (path("", include(router.urls)),)
