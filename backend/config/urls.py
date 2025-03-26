
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apis.urls.api_urls')),
    path('authentification/', include('apis.urls.auth_urls')),
    path('ics/', include('apis.urls.ics_urls'))
]
