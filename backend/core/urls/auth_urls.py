from core.views import auth_views
from django.urls import include, path
import django_cas_ng.views as cas_views

urlpatterns = [
    # CAS Views
    path("login/", cas_views.LoginView.as_view(), name='cas_ng_login'),
    path("logout/", cas_views.LogoutView.as_view(), name='cas_ng_logout'),
    path("callback/", cas_views.CallbackView.as_view(), name='cas_ng_proxy_callback'),

    # Custom Auth Views
    path("finalize/", auth_views.finalize, name="finalize"),
    path("temp/", auth_views.test_insertion, name ="temp"),
]