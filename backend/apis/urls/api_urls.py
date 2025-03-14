from apis.views import api_views
from django.urls import include, path

urlpatterns = [
    path('test',api_views.test),
    path('get_tds',api_views.get_tds)
]

