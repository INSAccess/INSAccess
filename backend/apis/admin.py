from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import (
    # Core Models
    UserProfile, InsaClass, InsaEvenement, Association, AssociationPublisher,
    GroupTD, Department, Teacher, Room, EvenementRoom,

    # Enum Models
    EnumType, EnumSector, EnumColor,

    # Link Models
    EvenementLinkEventRoom, ClassLinkTD, ClassLinkRoom, ClassLinkTeacher, 
    ClassLinkDepart, UserLinkTD
)

# === Custom Admin Site === #
class CustomAdminSite(AdminSite):
    site_header = "INSAccess Admin Dashboard"
    site_title = "INSAccess Admin"
    index_title = "Welcome to INSAccess Admin Panel"

    def get_app_list(self, request):
        """Customize admin sections"""
        app_list = super().get_app_list(request)

        custom_order = [
            {"name": "Core Models", "models": [
                "UserProfile", "InsaClass", "InsaEvenement",
                "Association", "Department", "Teacher", "Room"
            ]},
            {"name": "Enums", "models": ["EnumType", "EnumSector", "EnumColor"]},
            {"name": "Link Tables", "models": [
                "EvenementLinkEventRoom", "ClassLinkTD", "ClassLinkRoom", 
                "ClassLinkTeacher", "ClassLinkDepart", "UserLinkTD"
            ]}
        ]

        new_app_list = []
        for section in custom_order:
            section_models = []
            for app in app_list:
                for model in app["models"]:
                    if model["object_name"] in section["models"]:
                        section_models.append(model)
            
            if section_models:
                new_app_list.append({"name": section["name"], "models": section_models})
        
        return new_app_list

# Create an instance of the custom admin site
custom_admin_site = CustomAdminSite(name='custom_admin')

# === Register Models with the Custom Admin === #

# === INLINE MODELS === #

class ClassLinkTDInline(admin.TabularInline):
    model = ClassLinkTD
    extra = 1

class ClassLinkRoomInline(admin.TabularInline):
    model = ClassLinkRoom
    extra = 1

class ClassLinkTeacherInline(admin.TabularInline):
    model = ClassLinkTeacher
    extra = 1

class ClassLinkDepartInline(admin.TabularInline):
    model = ClassLinkDepart
    extra = 1

class EvenementLinkEventRoomInline(admin.TabularInline):
    model = EvenementLinkEventRoom
    extra = 1


# === CORE MODELS === #

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__email',)

class InsaClassAdmin(admin.ModelAdmin):
    list_display = ('desc', 'start_hour', 'end_hour')
    list_filter = ('time_created','desc')
    search_fields = ('desc',)
    inlines = [ClassLinkTDInline, ClassLinkRoomInline, ClassLinkTeacherInline, ClassLinkDepartInline]

class InsaEvenementAdmin(admin.ModelAdmin):
    list_display = ('desc', 'start_hour', 'end_hour', 'association')
    list_filter = ('time_created', 'association')
    search_fields = ('desc', 'association__name')
    inlines = [EvenementLinkEventRoomInline]

class AssociationAdmin(admin.ModelAdmin):
    list_display = ('name', 'unique_color', 'type', 'sector')
    search_fields = ('name','type','sector')

class AssociationPublisherAdmin(admin.ModelAdmin):
    list_display = ('assocation', 'user')
    search_fields = ('assocation__name', 'user__email')

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class RoomAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class EvenementRoomAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class GroupTDAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
    
# === LINK MODELS  === #

@admin.register(EvenementLinkEventRoom)
class EvenementLinkEventRoomAdmin(admin.ModelAdmin):
    list_display = ('evenement', 'room')

@admin.register(ClassLinkTD)
class ClassLinkTDAdmin(admin.ModelAdmin):
    list_display = ('insa_class', 'td')

@admin.register(ClassLinkRoom)
class ClassLinkRoomAdmin(admin.ModelAdmin):
    list_display = ('insa_class', 'room')

@admin.register(ClassLinkTeacher)
class ClassLinkTeacherAdmin(admin.ModelAdmin):
    list_display = ('insa_class', 'teacher')

@admin.register(ClassLinkDepart)
class ClassLinkDepartAdmin(admin.ModelAdmin):
    list_display = ('insa_class', 'depart')

@admin.register(UserLinkTD)
class UserLinkTDAdmin(admin.ModelAdmin):
    list_display = ('user', 'name_td')

custom_admin_site.register(UserProfile, UserProfileAdmin)
custom_admin_site.register(InsaClass, InsaClassAdmin)
custom_admin_site.register(InsaEvenement, InsaEvenementAdmin)
custom_admin_site.register(Association, AssociationAdmin)
custom_admin_site.register(AssociationPublisher, AssociationPublisherAdmin)
custom_admin_site.register(Department, DepartmentAdmin)
custom_admin_site.register(Teacher, TeacherAdmin)
custom_admin_site.register(Room, RoomAdmin)
custom_admin_site.register(EvenementRoom, EvenementRoomAdmin)
custom_admin_site.register(GroupTD, GroupTDAdmin)

# Enums
custom_admin_site.register(EnumType)
custom_admin_site.register(EnumSector)
custom_admin_site.register(EnumColor)

# Link Models
custom_admin_site.register(EvenementLinkEventRoom, EvenementLinkEventRoomAdmin)
custom_admin_site.register(ClassLinkTD, ClassLinkTDAdmin)
custom_admin_site.register(ClassLinkRoom, ClassLinkRoomAdmin)
custom_admin_site.register(ClassLinkTeacher, ClassLinkTeacherAdmin)
custom_admin_site.register(ClassLinkDepart, ClassLinkDepartAdmin)
custom_admin_site.register(UserLinkTD, UserLinkTDAdmin)