from django.urls import path
from apis.views import GetDayAPIView, GetWeekAPIView, GetMonthAPIView,\
    GetYearAPIView, GetTdsAPIView, PostTdsAPIView, GetIsConnectedAPIView, GetEventsAPIView



urlpatterns = [
    path('get_day/<str:day>/', GetDayAPIView.as_view(), name='get_day'),
    path('get_week/<str:day>/', GetWeekAPIView.as_view(), name='get_week'),
    path('get_month/<str:day>/', GetMonthAPIView.as_view(), name='get_month'),
    path('get_year/<str:day>/', GetYearAPIView.as_view(), name='get_year'),
    path('get_tds/<str:department>', GetTdsAPIView.as_view(), name='get_tds'),
    path('save_tds',PostTdsAPIView.as_view(), name='save_tds'),
    path('is_connected', GetIsConnectedAPIView.as_view(), name='is_connected'),
    path('get_events', GetEventsAPIView.as_view(), name='get_events')
]
