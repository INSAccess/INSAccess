from rest_framework import serializers
from .models import *
from django.utils.timezone import localtime

class GroupTDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupTD
        fields = ["name"]

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ["name"]

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["name"]

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["name"]

class InsaClassSerializer(serializers.ModelSerializer):
    link_td = GroupTDSerializer(many=True, read_only=True)
    link_teacher = TeacherSerializer(many=True, read_only=True)
    link_room = RoomSerializer(many=True, read_only=True)
    link_depart = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = InsaClass
        fields = ["uid", "date", "start_hour", "end_hour", "desc",
                  "link_td", "link_teacher", "link_room", "link_depart"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Format start_hour and end_hour to HHMM format for the frontend
        representation['start_hour'] = localtime(instance.start_hour).strftime("%H%M")
        representation['end_hour'] = localtime(instance.end_hour).strftime("%H%M")

        representation["link_td"] = [element["name"] for 
                                     element in representation["link_td"]]
        representation["link_teacher"] = [element["name"] for 
                                          element in representation["link_teacher"]]
        representation["link_room"] = [element["name"] for 
                                       element in representation["link_room"]]
        representation["link_depart"] = [element["name"] for 
                                         element in representation["link_depart"]]

        return representation

class EnumColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnumColor
        fields = ["value", "user_friendly_name"]

class EnumTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnumType
        fields = ["name"]

class EnumSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnumSector
        fields = ["name"]

class EnumColorThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnumColorTheme
        fields = ["name"]


class AssociationSerializer(serializers.ModelSerializer):
    unique_color = EnumColorSerializer(read_only = True)
    type = EnumTypeSerializer(read_only = True)
    sector = EnumSectorSerializer(read_only = True)
    
    class Meta:
        model = Association
        fields = ["name", "unique_color", "type", "sector"]


class EvenementRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvenementRoom
        fields = ["name"]




class InsaEvenementSerializer(serializers.ModelSerializer):
    link_room = serializers.SerializerMethodField()
    link_teacher = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = InsaEvenement
        fields = ["uid", "date", "start_hour", "end_hour", "desc",
                  "link", "link_teacher", "link_room"]

    def get_link_room(self, obj):
        return [room.name for room in obj.evenement_link_event_room.all()]
    
    def get_link_teacher(self, obj):
        return [obj.association.name,]

    def get_link(self, obj):
        return obj.associated_link

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['start_hour'] = localtime(instance.start_hour).strftime("%H%M")
        representation['end_hour'] = localtime(instance.end_hour).strftime("%H%M")

        return representation