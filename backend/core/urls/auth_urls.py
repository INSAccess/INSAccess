from core.views import auth_views
from django.urls import include, path
import django_cas_ng.views as cas_views

urlpatterns = [
    # CAS Views
    path("login/", cas_views.LoginView.as_view(), name='cas_ng_login'), #auth_views.user_login, name="login"),
    path("logout/", cas_views.LogoutView.as_view(), name='cas_ng_logout'), #auth_views.user_logout, name="logout"),
    path("callback/", cas_views.CallbackView.as_view(), name='cas_ng_proxy_callback'),

    # Custom Auth Views
    path("cas-callback/", auth_views.cas_callback_debug, name="cas_debug"),
    path("profile/", auth_views.profile, name="profile"),
    path("temp/", auth_views.test_insertion, name ="temp"),
    path("seed/", auth_views.seed_database, name ="temp_seeder")
]