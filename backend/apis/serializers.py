from django.forms import DateTimeField, TimeField
from rest_framework import serializers
from .models import InsaClass, GroupTD, Teacher, Room, Department

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
        fields = ["uid", "date", "start_hour", "end_hour", "desc", "link_td", "link_teacher", "link_room", "link_depart"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Format start_hour and end_hour to HHMM format fir the frontend
        representation['start_hour'] = instance.start_hour.strftime("%H%M")
        representation['end_hour'] = instance.end_hour.strftime("%H%M")
        
        return representation