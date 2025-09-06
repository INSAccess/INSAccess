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

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
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
    desc = TitleSerializer(read_only=True)

    class Meta:
        model = InsaClass
        fields = ["uid", "date", "start_hour", "end_hour", "desc",
                  "link_td", "link_teacher", "link_room", "link_depart"]

    def to_representation(self, instance):
        # flatten and format without additional ORM hits
        rep = super().to_representation(instance)
        rep['start_hour'] = localtime(instance.start_hour).strftime("%H%M")
        rep['end_hour'] = localtime(instance.end_hour).strftime("%H%M")
        rep['desc'] = rep['desc']['name']

        for field in ['link_td', 'link_teacher', 'link_room', 'link_depart']:
            rep[field] = [item['name'] for item in rep[field]]

        return rep

class UserColoredEventSerializer(serializers.Serializer):
    def to_representation(self, data):
        return {element.title.name: element.color for element in data}

class AssociationColoredEventSerializer(serializers.Serializer):
    def to_representation(self, data):
        return {element.name: element.color for element in data}

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
    type = EnumTypeSerializer(read_only=True)
    sector = EnumSectorSerializer(read_only=True)

    class Meta:
        model = Association
        fields = ["name", "color", "type", "sector"]

class InsaEvenementSerializer(serializers.ModelSerializer):
    link_teacher = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = InsaEvenement
        fields = ["uid", "date", "start_hour", "end_hour", "desc",
                  "link", "link_teacher", "location", "info"]

    def get_link_teacher(self, obj):
        return [obj.association.name] if obj.association else []

    def get_link(self, obj):
        return obj.associated_link

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['start_hour'] = localtime(instance.start_hour).strftime("%H%M")
        rep['end_hour'] = localtime(instance.end_hour).strftime("%H%M")
        rep['link_room'] = [rep.pop('location')]
        return rep
