# from account.views import home_screen_view
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # path('',home_screen_view, name="home"),
    path("admin/", admin.site.urls),
    path("account/", include("apps.account.urls")),
    path("", include("apps.store.urls")),
    path("", include("apps.substance.urls")),
]


# MEANS IF WE NOT IN PRODUCTION IF WE IN OUR DEVELOPMENT INVIROMENT
# GIVE HIM THE URL FOR STATIC AND MEDIA FILES
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
