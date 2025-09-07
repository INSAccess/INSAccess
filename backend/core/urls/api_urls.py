from django.urls import path
from core.views import (
    GetCalendarAPIView,
    GetTdsAPIView,
    PostTdsAPIView,
    GetIsConnectedAPIView,
    GetEvenementsAPIView,
    PostUserThemeAPIView,
    GetConfigFileAPIView,
    GetEnumThemeAPIView,
    PostInsaEvenementAPIView,
    PostUserColorAPIView,
    GetUserProfileAPIView,
    GetEnumLanguageAPIView,
    PostUserLanguageAPIView,
    DeleteEventAPIView,
    FriendsAPIView,
    UsersAPIView,
    FriendCalendarAPIView,
    GetIsAssociationPublisherAPIView,
)

urlpatterns = [
    # calendars urls
    path("get_calendar/<str:day>/", GetCalendarAPIView.as_view(), name="get_calendar"),
    path(
        "get_friend_calendar/<str:username>",
        FriendCalendarAPIView.as_view(),
        name="friend_calendar",
    ),
    path("get_evenements", GetEvenementsAPIView.as_view(), name="get_evenements"),
    # metadata urls
    path("get_tds/<str:department>", GetTdsAPIView.as_view(), name="get_tds"),
    path("get_themes", GetEnumThemeAPIView.as_view(), name="get_themes"),
    path("get_languages", GetEnumLanguageAPIView.as_view(), name="get_languages"),
    path("get_config", GetConfigFileAPIView.as_view(), name="get_config"),
    path("users/", UsersAPIView.as_view(), name="users"),
    # evements urls
    path(
        "post_insa_evenement",
        PostInsaEvenementAPIView.as_view(),
        name="post_insa_evenement",
    ),
    path(
        "delete_evenement/<str:uid>",
        DeleteEventAPIView.as_view(),
        name="post_delete_evenement",
    ),
    # user urls
    path("get_profile", GetUserProfileAPIView.as_view(), name="get_profile"),
    path("friends/", FriendsAPIView.as_view(), name="friends"),
    path("is_connected", GetIsConnectedAPIView.as_view(), name="is_connected"),
    path(
        "is_association",
        GetIsAssociationPublisherAPIView.as_view(),
        name="is_association",
    ),
    path("post_user_theme", PostUserThemeAPIView.as_view(), name="post_user_theme"),
    path(
        "post_user_language",
        PostUserLanguageAPIView.as_view(),
        name="post_user_language",
    ),
    path("post_user_color", PostUserColorAPIView.as_view(), name="post_user_color"),
    path("save_tds", PostTdsAPIView.as_view(), name="save_tds"),
]
