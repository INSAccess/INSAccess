from core.views import auth_views
from django.urls import include, path
import django_cas_ng.views as cas_views

urlpatterns = [
    # path("register/", auth_views.register, name="register"),
    path("login/", cas_views.LoginView.as_view(), name='cas_ng_login'), #auth_views.user_login, name="login"),
    path("logout/", cas_views.LogoutView.as_view(), name='cas_ng_logout'), #auth_views.user_logout, name="logout"),
    path("callback/", cas_views.CallbackView.as_view(), name='cas_ng_proxy_callback'),
    path("profile/", auth_views.profile, name="profile"),
    path("temp/", auth_views.test_insertion, name ="temp")
]