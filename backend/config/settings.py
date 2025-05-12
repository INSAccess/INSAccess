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

ALLOWED_HOSTS = []


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
]

MIDDLEWARE = [
    'core.utils.middleware_log.RequestLogMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
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

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://172.18.26.13:3000" # TEMPORARY USED FOR LOCALHOST TEST
]

CORS_ALLOW_HEADERS = default_headers

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://172.18.26.13:3000" # TEMPORARY USED FOR LOCALHOST TEST
]



ALLOWED_HOSTS = ["127.0.0.1", "localhost", "172.18.26.13"# TEMPORARY USED FOR LOCALHOST TEST
                 ]

CORS_URLS_REGEX = r'^/api/.*'



AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    # 'uniauth.backends.CASBackend',
]

LOGIN_URL = "authentification/login/" #LOGIN_URL = "/accounts/login/" for CAS implementation

UNIAUTH_LOGIN_DISPLAY_STANDARD = False
UNIAUTH_LOGOUT_CAS_COMPLETELY = True


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
