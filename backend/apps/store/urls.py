from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ImageListPagination, ImageVewSet, StoreSelectBarView, StoreVewSet

urlpatterns = [
    path("stores/select_list/", StoreSelectBarView.as_view(), name="all_stores"),
    path("images/all/", ImageListPagination.as_view(), name="all_images"),
]
router = DefaultRouter()
router.register(r"stores", StoreVewSet, basename="store")
router.register(r"images", ImageVewSet, basename="image")
urlpatterns += (path("", include(router.urls)),)
