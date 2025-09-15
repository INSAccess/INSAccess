from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import (
    UserProfile,
    InsaClass,
    InsaEvenement,
    Association,
    AssociationPublisher,
    GroupTD,
    Department,
    Teacher,
    Room,
    UserColoredEvent,
    UserRelationship,
    Title,
    EnumType,
    EnumSector,
    EnumColorTheme,
    EnumLanguage,
    ClassLinkTD,
    ClassLinkRoom,
    ClassLinkTeacher,
    ClassLinkDepart,
    UserLinkTD,
    UserLinkAssociation,
)


class CustomAdminSite(AdminSite):
    site_header = "INSAccess Admin Dashboard"
    site_title = "INSAccess Admin"
    index_title = "Welcome to INSAccess Admin Panel"

    def get_app_list(self, request):
        app_list = super().get_app_list(request)

        sections = [
            {
                "name": "Core Models",
                "models": [
                    "UserProfile",
                    "UserRelationship",
                    "InsaClass",
                    "InsaEvenement",
                    "AssociationPublisher",
                    "Association",
                    "Department",
                    "Teacher",
                    "Room",
                    "UserColoredEvent",
                    "GroupTD",
                    "Title",
                ],
            },
            {
                "name": "Enums",
                "models": ["EnumType", "EnumSector", "EnumLanguage", "EnumColorTheme"],
            },
            {
                "name": "Link Tables",
                "models": [
                    "ClassLinkTD",
                    "ClassLinkRoom",
                    "ClassLinkTeacher",
                    "ClassLinkDepart",
                    "UserLinkTD",
                    "UserLinkAssociation",
                ],
            },
        ]

        ordered_apps = []
        for section in sections:
            section_models = [
                model
                for app in app_list
                for model in app["models"]
                if model["object_name"] in section["models"]
            ]
            if section_models:
                ordered_apps.append({"name": section["name"], "models": section_models})

        return ordered_apps


custom_admin_site = CustomAdminSite(name="custom_admin")


# === Inlines === #
class BaseInline(admin.TabularInline):
    extra = 1


class ClassLinkTDInline(BaseInline):
    model = ClassLinkTD


class ClassLinkRoomInline(BaseInline):
    model = ClassLinkRoom


class ClassLinkTeacherInline(BaseInline):
    model = ClassLinkTeacher


class ClassLinkDepartInline(BaseInline):
    model = ClassLinkDepart


# === Core Models === #
@admin.register(UserProfile, site=custom_admin_site)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user__email",)


@admin.register(UserRelationship, site=custom_admin_site)
class UserRelationshipAdmin(admin.ModelAdmin):
    list_display = ("first_user", "second_user", "type")
    search_fields = ("first_user__username", "second_user__username", "type")


@admin.register(InsaClass, site=custom_admin_site)
class InsaClassAdmin(admin.ModelAdmin):
    list_display = ("desc", "start_hour", "end_hour")
    list_filter = ("time_created", "desc")
    search_fields = ("desc",)
    inlines = [
        ClassLinkTDInline,
        ClassLinkRoomInline,
        ClassLinkTeacherInline,
        ClassLinkDepartInline,
    ]


@admin.register(Association, site=custom_admin_site)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "color", "type", "sector")
    search_fields = ("name", "type", "sector")


@admin.register(InsaEvenement, site=custom_admin_site)
class InsaEvenementAdmin(admin.ModelAdmin):
    list_display = ("desc", "start_hour", "end_hour", "association")
    list_filter = ("time_created", "association")
    search_fields = ("desc", "association__name")


@admin.register(AssociationPublisher, site=custom_admin_site)
class AssociationPublisherAdmin(admin.ModelAdmin):
    list_display = ("association", "user")
    search_fields = ("association__name", "user__email")


@admin.register(Department, site=custom_admin_site)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Teacher, site=custom_admin_site)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Room, site=custom_admin_site)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(GroupTD, site=custom_admin_site)
class GroupTDAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(UserColoredEvent, site=custom_admin_site)
class UserColoredEventAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user",)


custom_admin_site.register(Title)


# === Enums === #
for enum_model in [EnumType, EnumSector, EnumColorTheme, EnumLanguage]:
    custom_admin_site.register(enum_model)


# === Link Models === #
@admin.register(ClassLinkTD, site=custom_admin_site)
class ClassLinkTDAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "td")


@admin.register(ClassLinkRoom, site=custom_admin_site)
class ClassLinkRoomAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "room")


@admin.register(ClassLinkTeacher, site=custom_admin_site)
class ClassLinkTeacherAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "teacher")


@admin.register(ClassLinkDepart, site=custom_admin_site)
class ClassLinkDepartAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "depart")


@admin.register(UserLinkTD, site=custom_admin_site)
class UserLinkTDAdmin(admin.ModelAdmin):
    list_display = ("user", "name_td")


@admin.register(UserLinkAssociation, site=custom_admin_site)
class UserLinkAssociationAdmin(admin.ModelAdmin):
    list_display = ("user", "name_assos")
