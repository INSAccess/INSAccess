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
    BugReportAPIView,
    GetAssociationAPIView,
    PostAssociationAPIView,
    ChangeCasSyncAPIView,
    UpdateUsingCasTDAPIView,
    PostUserDepartementAPIView,
    ChangeICSLinkAPIView,
    RoomCalendarAPIView,
    RoomsAPIView,
)

urlpatterns = [
    # calendars urls
    path("calendar/", GetCalendarAPIView.as_view(), name="get_calendar"),
    path(
        "calendar/friend/<str:username>",
        FriendCalendarAPIView.as_view(),
        name="friend_calendar",
    ),
    path(
        "calendar/room/<str:roomname>",
        RoomCalendarAPIView.as_view(),
        name="room_calendar",
    ),
    path("calendar/events", GetEvenementsAPIView.as_view(), name="get_evenements"),
    # metadata urls
    path(
        "metadata/td_groups/<str:department>", GetTdsAPIView.as_view(), name="get_tds"
    ),
    path("metadata/themes", GetEnumThemeAPIView.as_view(), name="get_themes"),
    path("metadata/rooms", RoomsAPIView.as_view(), name="get_rooms"),
    path(
        "metadata/associations",
        GetAssociationAPIView.as_view(),
        name="get_associations",
    ),
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
    path("user/friends", FriendsAPIView.as_view(), name="friends"),
    path("user/is_connected", GetIsConnectedAPIView.as_view(), name="is_connected"),
    path(
        "user/is_association",
        GetIsAssociationPublisherAPIView.as_view(),
        name="is_association",
    ),
    path("user/theme", PostUserThemeAPIView.as_view(), name="post_user_theme"),
    path(
        "user/departement",
        PostUserDepartementAPIView.as_view(),
        name="post_user_departement",
    ),
    path(
        "user/language",
        PostUserLanguageAPIView.as_view(),
        name="post_user_language",
    ),
    path("user/color", PostUserColorAPIView.as_view(), name="post_user_color"),
    path("user/td_groups", PostTdsAPIView.as_view(), name="save_tds"),
    path(
        "user/associations", PostAssociationAPIView.as_view(), name="save_associations"
    ),
    path("user/bug", BugReportAPIView.as_view(), name="bug_report"),
    path(
        "user/cas_autosync/<str:enable>",
        ChangeCasSyncAPIView.as_view(),
        name="change cas_autosync",
    ),
    path(
        "user/cas_sync", UpdateUsingCasTDAPIView.as_view(), name="update_td_using_cas"
    ),
    path("user/change_ics", ChangeICSLinkAPIView.as_view(), name="change_ics"),
]
