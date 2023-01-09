# from account.views import home_screen_view
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

...

schema_view = get_schema_view(
    openapi.Info(
        title="Mountain API",
        default_version="v1",
        description="Mountain API Documintatioun",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="forprokm@gmail.com"),
        license=openapi.License(name="KRM License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=(),
)


urlpatterns = [
    # path('',home_screen_view, name="home"),
    path("admin/", admin.site.urls),
    path("account/", include("apps.account.urls")),
    path("", include("apps.store.urls")),
    path("", include("apps.substance.urls")),
    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    re_path(r"^swagger/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]


# MEANS IF WE NOT IN PRODUCTION IF WE IN OUR DEVELOPMENT INVIROMENT
# GIVE HIM THE URL FOR STATIC AND MEDIA FILES
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
