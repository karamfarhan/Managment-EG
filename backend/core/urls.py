# from account.views import home_screen_view
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

...


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/account/", include("apps.account.urls")),
    path("api/v1/", include("apps.store.urls")),
    path("api/v1/", include("apps.substance.urls")),
    path("api/v1/", include("apps.employee.urls")),
    path("api/v1/", include("apps.car.urls")),
]


# MEANS IF WE NOT IN PRODUCTION IF WE IN OUR DEVELOPMENT INVIROMENT
# GIVE HIM THE URL FOR STATIC AND MEDIA FILES
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
