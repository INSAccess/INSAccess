from django.urls import path
from apis.views.ics_views import generate_ics


urlpatterns = [
    path('<encrypted_id>/', generate_ics, name='generate_ics'),
]

