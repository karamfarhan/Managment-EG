from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ImageViewSet, StoreSelectBarView, StoreViewSet

urlpatterns = [
    path("stores/select_list/", StoreSelectBarView.as_view(), name="stores_select_list"),
]


# GET IMAGES : images/all/      [10 per page + search  (store address _ created_at _ username) [such : invoice ] + pagination]

# POST IMAGES : images/

# DELETE


router = DefaultRouter()
router.register(r"stores", StoreViewSet, basename="store")
router.register(r"images", ImageViewSet, basename="image")
urlpatterns += (path("", include(router.urls)),)
