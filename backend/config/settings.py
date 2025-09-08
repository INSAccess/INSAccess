import environ
import os
import sys
from pathlib import Path
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env()

HOST_IP = env("HOST_IP", default="localhost")

SECRET_KEY = "django-insecure-n%of#5dk!t(((--f9-48qqi!u6ooo6(zv&hvu_c&3hk4lbo*1&"

DEBUG = True

INSTALLED_APPS = [
    "core",
    "corsheaders",
    "uniauth",
    "rest_framework",
    "drf_yasg",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_cas_ng",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django_cas_ng.middleware.CASMiddleware",
    "core.utils.middleware_log.RequestLogMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CORS_ALLOW_HEADERS = default_headers

PORTS = ["", "8000", "3000", "80", "3004"]

CSRF_TRUSTED_ORIGINS = [
    f"http://{HOST_IP}:{port}" if port else f"http://{HOST_IP}" for port in PORTS
]

ALLOWED_HOSTS = [
    HOST_IP,
]

CORS_URLS_REGEX = r"^/api/.*"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "django_cas_ng.backends.CASBackend",
]

# Configuration CAS
CAS_SERVER_URL = env("CAS_SERVER_URL", default="cas_server")
CAS_VERSION = 3


CAS_LOGOUT_COMPLETELY = True
CAS_REDIRECT_URL = "/authentification/finalize"
LOGOUT_REDIRECT_URL = "/authentification/login"

CAS_IGNORE_REFERER = True

CAS_CREATE_USER = True

LOGIN_URL = "/authentification/login/"

CAS_APPLY_ATTRIBUTES_TO_USER = True
CAS_RENAME_ATTRIBUTES = {
    "mail": "email",
    "displayName": "first_name",
}

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME", default="db.postgresql"),
        "USER": env("DB_USER", default="root"),
        "PASSWORD": env("DB_PASSWORD", default="toto123"),
        "HOST": env("DB_HOST", default="db"),
        "PORT": "5432",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "fr-FR"

TIME_ZONE = "Europe/Paris"

USE_I18N = True

USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "staticfiles" / "static",
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DJANGO_LOG_LEVEL = os.getenv("DJANGO_LOG_LEVEL", "INFO")
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "request_filter": {
            "()": "core.utils.middleware_log.RequestLogFilter",
        },
    },
    "formatters": {
        "simple_request": {
            "format": (
                "[%(asctime)s] [%(levelname)s] "
                "[user: %(user_username)s id:%(user_id)s] "
                "[%(method)s %(path)s] "
                "[ua: %(user_agent)s] - %(message)s"
            ),
            "style": "%",
        },
    },
    "handlers": {
        "console_stdout": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "simple_request",
            "filters": ["request_filter"],
            "stream": sys.stdout,
        },
        "console_stderr": {
            "class": "logging.StreamHandler",
            "level": "ERROR",
            "formatter": "simple_request",
            "filters": ["request_filter"],
            "stream": sys.stderr,
        },
    },
    "loggers": {
        "": {
            "handlers": ["console_stdout", "console_stderr"],
            "level": "INFO",
        },
    },
}

LOCAL_SETTINGS = os.path.join(BASE_DIR, "config/", "local_settings.py")

if os.path.isfile(LOCAL_SETTINGS):
    try:
        from config.local_settings import *  # noqa: F403
    except ImportError:
        pass
