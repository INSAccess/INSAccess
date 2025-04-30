
from django.contrib import admin
from django.urls import include, path

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from core.admin import custom_admin_site,event_admin


schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version="v1",
        description="API documentation for my Django app",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="CC BY-NC-SA 4.0"),
    ),
    public=True,
    permission_classes=(permissions.IsAdminUser,),
)

urlpatterns = [
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="redoc"),
    path("swagger.json", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger.yaml", schema_view.without_ui(cache_timeout=0), name="schema-yaml"),
    
    path('admin/default', admin.site.urls),
    path('admin/custom', custom_admin_site.urls),
    path('admin/event', event_admin.urls),
    path('api/', include('core.urls.api_urls')),
    path('authentification/', include('core.urls.auth_urls')),
    path('ics/', include('core.urls.ics_urls'))
]
