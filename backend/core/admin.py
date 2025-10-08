from django.contrib import admin
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

original_get_app_list = admin.site.get_app_list


def custom_get_app_list(request, app_label=None):
    # get all apps/models already registered (includes auth.User etc.)
    app_list = original_get_app_list(request, app_label)

    # your custom grouping
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

    # first, add your grouped sections
    for section in sections:
        section_models = [
            model
            for app in app_list
            for model in app["models"]
            if model["object_name"] in section["models"]
        ]
        if section_models:
            ordered_apps.append({"name": section["name"], "models": section_models})

    # then, add any remaining apps that were not included
    used_models = [
        model["object_name"] for section in ordered_apps for model in section["models"]
    ]
    for app in app_list:
        remaining_models = [
            m for m in app["models"] if m["object_name"] not in used_models
        ]
        if remaining_models:
            ordered_apps.append({"name": app["name"], "models": remaining_models})

    return ordered_apps


# patch the method
admin.site.get_app_list = custom_get_app_list

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


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user__email",)


@admin.register(UserRelationship)
class UserRelationshipAdmin(admin.ModelAdmin):
    list_display = ("first_user", "second_user", "type")
    search_fields = ("first_user__username", "second_user__username", "type")


@admin.register(InsaClass)
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


@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "color", "type", "sector")
    search_fields = ("name", "type", "sector")


@admin.register(InsaEvenement)
class InsaEvenementAdmin(admin.ModelAdmin):
    list_display = ("desc", "start_hour", "end_hour", "association")
    list_filter = ("time_created", "association")
    search_fields = ("desc", "association__name")


@admin.register(AssociationPublisher)
class AssociationPublisherAdmin(admin.ModelAdmin):
    list_display = ("association", "user")
    search_fields = ("association__name", "user__email")


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(GroupTD)
class GroupTDAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(UserColoredEvent)
class UserColoredEventAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user",)


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    pass


# === Enums === #
for enum_model in [EnumType, EnumSector, EnumColorTheme, EnumLanguage]:
    admin.site.register(enum_model)


# === Link Models === #


@admin.register(ClassLinkTD)
class ClassLinkTDAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "td")


@admin.register(ClassLinkRoom)
class ClassLinkRoomAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "room")


@admin.register(ClassLinkTeacher)
class ClassLinkTeacherAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "teacher")


@admin.register(ClassLinkDepart)
class ClassLinkDepartAdmin(admin.ModelAdmin):
    list_display = ("insa_class", "depart")


@admin.register(UserLinkTD)
class UserLinkTDAdmin(admin.ModelAdmin):
    list_display = ("user", "name_td")


@admin.register(UserLinkAssociation)
class UserLinkAssociationAdmin(admin.ModelAdmin):
    list_display = ("user", "name_assos")
