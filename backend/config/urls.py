
from django.contrib import admin
from django.urls import include, path, re_path
from core.admin import custom_admin_site
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/default', admin.site.urls),
    path('admin/custom', custom_admin_site.urls),
    path('api/', include('core.urls.api_urls')),
    path('authentification/', include('core.urls.auth_urls')),
    path('ics/', include('core.urls.ics_urls')),
    path('', TemplateView.as_view(template_name='index.html'))
]

urlpatterns += [
    re_path(
        r'^(?!api/|admin/|authentification/|ics/|static/|media/).*$',
        TemplateView.as_view(template_name='index.html')
    ),
]