from core.views import auth_views
from django.urls import include, path

urlpatterns = [
    path("register/", auth_views.register, name="register"),
    path("login/", auth_views.user_login, name="login"),
    path("logout/", auth_views.user_logout, name="logout"),
    path("profile/", auth_views.profile, name="profile"),
    path("temp/", auth_views.test_insertion, name ="temp")
]