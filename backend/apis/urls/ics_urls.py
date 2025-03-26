from django.urls import path
from apis.views.ics_views import generate_ics


urlpatterns = [
    path('<int:user_id>/', generate_ics, name='generate_ics'),
]

