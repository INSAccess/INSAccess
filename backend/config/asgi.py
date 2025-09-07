"""
ASGI config for backend project.
"""

from django.core.asgi import get_asgi_application
import os


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_asgi_application()
