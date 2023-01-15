from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmployeeViewSet

urlpatterns = []
router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employee")
urlpatterns += (path("", include(router.urls)),)
