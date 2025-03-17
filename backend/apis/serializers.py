from django.forms import DateTimeField
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
    start_hour = DateTimeField(format="%H%M", read_only=True)
    end_hour = DateTimeField(format="%H%M", read_only=True)


    class Meta:
        model = InsaClass
        fields = ["uid", "date", "start_hour", "end_hour", "desc", "link_td", "link_teacher", "link_room", "link_depart"]
