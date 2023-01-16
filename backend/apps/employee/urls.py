from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmployeeActivityViewSet, EmployeeViewSet

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employee")
urlpatterns = [
    path("", include(router.urls)),
    path("export/employees/", EmployeeViewSet.as_view({"get": "export"}), name="employees-export"),
    path("employees/<int:id>/activity/", EmployeeActivityViewSet.as_view({"get": "list", "post": "create"})),
    path("export/employees/<int:id>/activity/", EmployeeActivityViewSet.as_view({"get": "export"})),
]
