from django.urls import path
from core.views.ics_views import ics_feed


urlpatterns = [
    path("<ics_uid>/", ics_feed, name="ics_feed"),
]
