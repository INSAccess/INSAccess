from core.views import auth_views
from django.urls import path
import django_cas_ng.views as cas_views

urlpatterns = [
    # CAS Views
    path("login/", cas_views.LoginView.as_view(), name="cas_ng_login"),
    path("logout/", cas_views.LogoutView.as_view(), name="cas_ng_logout"),
    # Custom Auth Views
    path("finalize/", auth_views.finalize, name="finalize"),
]
