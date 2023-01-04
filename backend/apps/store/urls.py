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


# # Create a router and register our viewsets with it.
# urlpatterns = [
#     path('', include(router.urls)),
# ]
# router = DefaultRouter()
# router.register(r'snippets', views.SnippetViewSet,basename="snippet")
# router.register(r'users', views.UserViewSet,basename="user")
# urlpatterns += path('', include(router.urls)),
# # The API URLs are now determined automatically by the router.
