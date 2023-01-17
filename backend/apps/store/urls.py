from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ImageViewSet, InvoiceViewSet, StoreSelectBarView, StoreViewSet

urlpatterns = [
    path("stores/<int:id>/invoices/", InvoiceViewSet.as_view({"get": "list", "post": "create"}), name="invoices"),
    path("invoices/<int:pk>/", InvoiceViewSet.as_view({"get": "retrieve"}), name="invoice"),
    path("export/stores/<int:id>/invoices/", InvoiceViewSet.as_view({"get": "export"}), name="invoices-export"),
    path("stores/select_list/", StoreSelectBarView.as_view(), name="stores_select_list"),
    path("export/stores/", StoreViewSet.as_view({"get": "export"}), name="stores-export"),
]


router = DefaultRouter()
router.register(r"stores", StoreViewSet, basename="store")
router.register(r"images", ImageViewSet, basename="image")
urlpatterns += (path("", include(router.urls)),)
