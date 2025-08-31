from django.urls import path
from core.views.ics_views import generate_ics


urlpatterns = [
    path('<ics_uid>/', generate_ics, name='generate_ics'),
]

