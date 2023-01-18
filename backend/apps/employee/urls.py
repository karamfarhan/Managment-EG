from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmployeeActivityViewSet, EmployeeViewSet

urlpatterns = [
    path("export/employees/", EmployeeViewSet.as_view({"get": "export"}), name="employees-export"),
    path(
        "employees/<int:id>/activity/",
        EmployeeActivityViewSet.as_view({"get": "list", "post": "create", "put": "update", "patch": "update"}),
    ),
    path("export/employees/<int:id>/activity/", EmployeeActivityViewSet.as_view({"get": "export"})),
]

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employee")
urlpatterns += (path("", include(router.urls)),)
