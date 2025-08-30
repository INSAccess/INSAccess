import environ, os
from pathlib import Path
from corsheaders.defaults import default_headers
from core.utils.logging import RequestFilter

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env()

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-n%of#5dk!t(((--f9-48qqi!u6ooo6(zv&hvu_c&3hk4lbo*1&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Application definition

INSTALLED_APPS = [
    'core',
    'corsheaders',
    'uniauth',
    'rest_framework',
    'drf_yasg',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_cas_ng',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'core.utils.middleware_log.RequestLogMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django_cas_ng.middleware.CASMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3004",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3004",
]

CORS_ALLOW_HEADERS = default_headers

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3004",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3004",
]

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
]

CORS_URLS_REGEX = r'^/api/.*'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'django_cas_ng.backends.CASBackend',
    # 'uniauth.backends.CASBackend',
]

# Configuration CAS
CAS_SERVER_URL = 'http://192.168.1.18:3004/cas/'
CAS_VERSION = 3
#CAS_SERVER_URL = 'https://cas.insa-rouen.fr/cas/'

CAS_LOGOUT_COMPLETELY = True
CAS_REDIRECT_URL = '/authentification/profile'

CAS_CREATE_USER = True

# Only for dev
CAS_ROOT_PROXIED_AS = None
CAS_FORCE_CHANGE_USERNAME_CASE = None
CAS_IGNORE_REFERER = True

LOGIN_URL = "authentification/login/"

CAS_APPLY_ATTRIBUTES_TO_USER = True
CAS_RENAME_ATTRIBUTES = {
    'email':'email',
    'firstName':'first_name',
    'lastName':'last_name',
}

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME', default='db.postgresql'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default='toto123'),
        'HOST': env('DB_HOST', default='db'),
        'PORT': '5432',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'fr-FR'

TIME_ZONE = 'Europe/Paris'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


BASE_DIR = Path(__file__).resolve().parent.parent
DJANGO_LOG_LEVEL = os.getenv('DJANGO_LOG_LEVEL', 'INFO')

LOG_DIR = os.path.join(BASE_DIR, 'core', 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'filters': {
        'request_filter': {
            '()': RequestFilter,
        },
    },

    'formatters': {
        'with_request': {
            'format': (
                '[%(userip)s] - [%(user)s] - [%(sessionid)s] - '
                '[%(asctime)s] - [%(method)s %(path)s] - '
                '[%(status_code)s] - [%(message)s] - '
                '[%(base_url)s|%(referer)s] - '
                '[%(user_agent)s]'
            ),
            'style': '%',
        },
    },

    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': DJANGO_LOG_LEVEL,
            'formatter': 'with_request',
            'filters': ['request_filter'],
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': DJANGO_LOG_LEVEL,
            'formatter': 'with_request',
            'filters': ['request_filter'],
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 10_485_760,
            'backupCount': 5,
            'encoding': 'utf-8',
        },
    },

    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': DJANGO_LOG_LEVEL,
        },
    },
}


LOCAL_SETTINGS = os.path.join(BASE_DIR,'config/', "local_settings.py")

if os.path.isfile(LOCAL_SETTINGS):
     try:
         from config.local_settings import *
     except ImportError:
         pass
