from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmployeeActivityViewSet, EmployeeViewSet

urlpatterns = [
    path("employees/<int:id>/activity/", EmployeeActivityViewSet.as_view({"get": "list", "post": "create"}))
]

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employee")
urlpatterns += (path("", include(router.urls)),)
