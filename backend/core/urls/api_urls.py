from django.urls import path
from core.views import(
    GetCalendarAPIView, GetTdsAPIView, PostTdsAPIView, GetIsConnectedAPIView,
    GetIcsUrlAPIView, GetEvenementsAPIView, GetUserThemeAPIView, PostUserThemeAPIView, GetConfigFileAPIView
    ,GetEnumThemeAPIView, PostInsaEvenementAPIView,GetIsAssociationPublisherAPIView, PostUserColorAPIView, GetUserProfileAPIView,
    GetUserLanguageAPIView, GetEnumLanguageAPIView, PostUserLanguageAPIView, DeleteEventAPIView, FriendsAPIView, UsersAPIView,
    FriendCalendarAPIView)

urlpatterns = [

    path('get_calendar/<str:day>/', GetCalendarAPIView.as_view(), name='get_calendar'),
    path('get_tds/<str:department>', GetTdsAPIView.as_view(), name='get_tds'),
    path('save_tds',PostTdsAPIView.as_view(), name='save_tds'),
    path('is_connected', GetIsConnectedAPIView.as_view(), name='is_connected'),
    path('is_association', GetIsAssociationPublisherAPIView.as_view(), name='is_association'),
    path('get_ics_url', GetIcsUrlAPIView.as_view(), name='get_ics_url'),
    path('get_evenements', GetEvenementsAPIView.as_view(), name ='get_evenements'),
    path('get_user_theme', GetUserThemeAPIView.as_view(), name ='get_user_theme'),
    path('get_themes', GetEnumThemeAPIView.as_view(), name='get_themes'),
    path('get_user_language', GetUserLanguageAPIView.as_view(), name ='get_user_language'),
    path('get_languages', GetEnumLanguageAPIView.as_view(), name='get_languages'),
    path('post_user_theme', PostUserThemeAPIView.as_view(), name ='post_user_theme'),
    path('post_user_language', PostUserLanguageAPIView.as_view(), name ='post_user_language'),
    path('get_config', GetConfigFileAPIView.as_view(), name='get_config'),
    path('post_insa_evenement', PostInsaEvenementAPIView.as_view(), name='post_insa_evenement'),
    path('post_user_color', PostUserColorAPIView.as_view(), name='post_user_color'),
    path('get_profile', GetUserProfileAPIView.as_view(), name='get_profile'),
    path('delete_evenement/<str:uid>', DeleteEventAPIView.as_view(), name='post_delete_evenement'),
    path('friends/', FriendsAPIView.as_view(), name='friends'),
    path('users/', UsersAPIView.as_view(), name='users'),
    path('get_friend_calendar/<str:username>', FriendCalendarAPIView.as_view(), name='friend_calendar'),


]
