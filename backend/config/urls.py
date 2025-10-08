from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve
import os

ROOT_STATIC = os.path.join(settings.BASE_DIR, "staticfiles", "static")

urlpatterns = [
    # Admin routes
    path("admin", admin.site.urls),
    # API / auth / ICS routes
    path("api/", include("core.urls.api_urls")),
    path("authentification/", include("core.urls.auth_urls")),
    path("ics/", include("core.urls.ics_urls")),
    # Serve React root files (icons, manifest, robots.txt)
    re_path(
        r"^(?P<path>[^/]+\.(ico|png|svg|webmanifest|json|txt))$",
        serve,
        {"document_root": ROOT_STATIC},
    ),
    # Catch-all for React routes
    re_path(
        r"^(?!api/|admin|authentification/|ics/|static/|media/).*$",
        TemplateView.as_view(template_name="index.html"),
    ),
]
