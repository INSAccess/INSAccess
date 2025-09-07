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
    path("calendar/", GetCalendarAPIView.as_view(), name="get_calendar"),
    path(
        "calendar/friend/<str:username>",
        FriendCalendarAPIView.as_view(),
        name="friend_calendar",
    ),
    path("calendar/events", GetEvenementsAPIView.as_view(), name="get_evenements"),
    # metadata urls
    path(
        "metadata/td_groups/<str:department>", GetTdsAPIView.as_view(), name="get_tds"
    ),
    path("metadata/themes", GetEnumThemeAPIView.as_view(), name="get_themes"),
    path("metadata/languages", GetEnumLanguageAPIView.as_view(), name="get_languages"),
    path("metadata/config", GetConfigFileAPIView.as_view(), name="get_config"),
    path("metadata/users", UsersAPIView.as_view(), name="users"),
    # evements urls
    path(
        "events",
        PostInsaEvenementAPIView.as_view(),
        name="post_insa_evenement",
    ),
    path(
        "events/<str:uid>",
        DeleteEventAPIView.as_view(),
        name="delete_events",
    ),
    # user urls
    path("user/profile", GetUserProfileAPIView.as_view(), name="get_profile"),
    path("user/friends/", FriendsAPIView.as_view(), name="friends"),
    path("user/is_connected", GetIsConnectedAPIView.as_view(), name="is_connected"),
    path(
        "user/is_association",
        GetIsAssociationPublisherAPIView.as_view(),
        name="is_association",
    ),
    path("user/theme", PostUserThemeAPIView.as_view(), name="post_user_theme"),
    path(
        "user/language",
        PostUserLanguageAPIView.as_view(),
        name="post_user_language",
    ),
    path("user/color", PostUserColorAPIView.as_view(), name="post_user_color"),
    path("user/td_groups", PostTdsAPIView.as_view(), name="save_tds"),
]
