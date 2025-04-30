from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from .models import (
    # Core Models
    UserProfile, InsaClass, InsaEvenement, Association, AssociationPublisher,
    GroupTD, Department, Teacher, Room, EvenementRoom,

    # Enum Models
    EnumType, EnumSector, EnumColor,EnumColorTheme,

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
                "UserProfile", "InsaClass", "InsaEvenement","AssociationPublisher",
                "Association", "Department", "Teacher", "Room"
            ]},
            {"name": "Enums", "models": ["EnumType", "EnumSector", "EnumColor", "EnumColorTheme"]},
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

class AssociationAdmin(admin.ModelAdmin):
    list_display = ('name', 'unique_color', 'type', 'sector')
    search_fields = ('name','type','sector')


class InsaEvenementAdmin(admin.ModelAdmin):
    list_display = ('desc', 'start_hour', 'end_hour', 'association')
    list_filter = ('time_created', 'association')
    search_fields = ('desc', 'association__name')
    

class AssociationPublisherAdmin(admin.ModelAdmin):
    list_display = ('association', 'user')
    search_fields = ('association__name', 'user__email')

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
custom_admin_site.register(Association, AssociationAdmin)
custom_admin_site.register(InsaEvenement, InsaEvenementAdmin)
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
custom_admin_site.register(EnumColorTheme)

# Link Models
custom_admin_site.register(EvenementLinkEventRoom, EvenementLinkEventRoomAdmin)
custom_admin_site.register(ClassLinkTD, ClassLinkTDAdmin)
custom_admin_site.register(ClassLinkRoom, ClassLinkRoomAdmin)
custom_admin_site.register(ClassLinkTeacher, ClassLinkTeacherAdmin)
custom_admin_site.register(ClassLinkDepart, ClassLinkDepartAdmin)
custom_admin_site.register(UserLinkTD, UserLinkTDAdmin)


# === Custom Evenement Adder Site === #

# custom view for InsaEvenement
class InsaEvenementPublish(admin.ModelAdmin):
    list_display = ('desc', 'start_hour', 'end_hour')
    list_filter = ('date',)
    search_fields = ('desc',)
    ordering = ('-date',)
    inlines = [EvenementLinkEventRoomInline]
    
    def get_queryset(self, request):
        """affiche seulement les event de l'association si pas admin"""
        qs = super().get_queryset(request)
        # si superuser, tout voir
        if request.user.is_superuser:
            return qs
        # sinon, seulement les événements de l'assos de l'utilisateur
        return qs.filter(association = AssociationPublisher.objects.get(user=request.user).association)

    def has_change_permission(self, request, obj=None):
        """donne le droit de changer si l'utilisateur est un publisher et qui appartient a l'assos"""
        if obj is None:
            return True
        return obj.association == AssociationPublisher.objects.get(user=request.user).association

    def has_delete_permission(self, request, obj=None):
        """donne le droit de supprimer si l'utilisateur est un publisher et qui appartient a l'assos"""
        if obj is None:
            return True
        return obj.association == AssociationPublisher.objects.get(user=request.user).association


    def has_view_permission(self, request, obj=None):
        """ cache la vue détaillée si hors-club """
        if obj is None:
            return True
        return obj.association == AssociationPublisher.objects.get(user=request.user).association


    def save_model(self, request, obj, form, change):
        """si création, forcer l'association a l'assos de l'utilisateur """
        if not change and not request.user.is_superuser:
            obj.association = AssociationPublisher.objects.get(user=request.user).association
        super().save_model(request, obj, form, change)

#custom View
class EventAdminSite(AdminSite):
    site_header = "Espace événements"
    site_title = "Gestion des événements"
    index_title = "Bienvenue"

    def has_permission(self, request):
        return (
            request.user.is_active
            and AssociationPublisher.objects.filter(user=request.user).exists()
        )

event_admin = EventAdminSite(name='event_admin')
event_admin.register(InsaEvenement, InsaEvenementPublish)

