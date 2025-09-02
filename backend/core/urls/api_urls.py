from django.urls import path
from core.views import GetDayAPIView, GetWeekAPIView, GetMonthAPIView,\
    GetYearAPIView, GetTdsAPIView, PostTdsAPIView, GetIsConnectedAPIView, GetEventsAPIView,\
    GetIcsUrlAPIView, GetEvenementsAPIView, GetUserThemeAPIView, PostUserThemeAPIView, GetConfigFileAPIView\
    ,GetEnumThemeAPIView, PostInsaEvenement,GetIsAssociationPublisherAPIView, PostUserColor

urlpatterns = [
    path('get_day/<str:day>/', GetDayAPIView.as_view(), name='get_day'),
    path('get_week/<str:day>/', GetWeekAPIView.as_view(), name='get_week'),
    path('get_month/<str:day>/', GetMonthAPIView.as_view(), name='get_month'),
    path('get_year/<str:day>/', GetYearAPIView.as_view(), name='get_year'),
    path('get_tds/<str:department>', GetTdsAPIView.as_view(), name='get_tds'),
    path('save_tds',PostTdsAPIView.as_view(), name='save_tds'),
    path('is_connected', GetIsConnectedAPIView.as_view(), name='is_connected'),
    path('is_association', GetIsAssociationPublisherAPIView.as_view(), name='is_association'),
    path('get_events', GetEventsAPIView.as_view(), name='get_events'),
    path('get_ics_url', GetIcsUrlAPIView.as_view(), name='get_ics_url'),
    path('get_evenements', GetEvenementsAPIView.as_view(), name ='get_evenements'),
    path('get_user_theme', GetUserThemeAPIView.as_view(), name ='get_user_theme'),
    path('get_themes', GetEnumThemeAPIView.as_view(), name='get_themes'),
    path('post_theme', PostUserThemeAPIView.as_view(), name ='post_theme'),
    path('get_config', GetConfigFileAPIView.as_view(), name='get_config'),
    path('post_insa_evenement', PostInsaEvenement.as_view(), name='post_insa_evenement'),
    path('post_user_color', PostUserColor.as_view(), name='post_user_color'),

]
