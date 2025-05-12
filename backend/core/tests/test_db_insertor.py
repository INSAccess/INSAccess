from django.test import TestCase
from core.models import (
    InsaClass, Title, Room, Teacher, GroupTD, Department,
    ClassLinkRoom, ClassLinkTeacher, ClassLinkTD, ClassLinkDepart
)
from core.utils.db_insertor import insert_list_record
from datetime import datetime, timedelta, timezone

class InsertListRecordTests(TestCase):
    def setUp(self):
        now = datetime.now(timezone.utc)
        self.base_data = {
            "uid": "uid-123",
            "time_stamp": now,
            "time_start": now + timedelta(hours=1),
            "time_end": now + timedelta(hours=2),
            "date": now.date(),
            "desc": "Algebra",
            "time_created": now - timedelta(days=1),
            "time_last_modified": now,
            "sequence": 1,
            "locations": ["Room A"],
            "teachers": ["Prof. Einstein"],
            "td_tags": ["TD42"],
            "departments": ["MATH"]
        }

    def test_insert_new_insaclass(self):
        insert_list_record([self.base_data])

        insa_class = InsaClass.objects.get(uid="uid-123")
        self.assertEqual(insa_class.desc.name, "Algebra")
        self.assertEqual(ClassLinkRoom.objects.count(), 1)
        self.assertEqual(ClassLinkTeacher.objects.count(), 1)
        self.assertEqual(ClassLinkTD.objects.count(), 1)
        self.assertEqual(ClassLinkDepart.objects.count(), 1)

    def test_update_existing_insaclass_on_sequence_change(self):
        insert_list_record([self.base_data])
        self.base_data["sequence"] = 2
        insert_list_record([self.base_data])

        self.assertEqual(InsaClass.objects.count(), 1)
        self.assertEqual(InsaClass.objects.first().sequence, 2)

    def test_ignore_update_if_sequence_same(self):
        insert_list_record([self.base_data])
        insert_list_record([self.base_data])

        self.assertEqual(InsaClass.objects.count(), 1)
        self.assertEqual(ClassLinkTeacher.objects.count(), 1)

    def test_deletion_of_removed_uid(self):
        new_data = self.base_data.copy()
        new_data["uid"] = "uid-999"
        new_data["desc"] = "Geometry"
        insert_list_record([new_data])

        self.assertEqual(InsaClass.objects.count(), 1)
        self.assertEqual(InsaClass.objects.first().uid, "uid-999")
        self.assertEqual(Title.objects.count(), 1)

    def test_multiple_classes_creation(self):
        data2 = self.base_data.copy()
        data2["uid"] = "uid-222"
        data2["desc"] = "Calculus"
        data2["locations"] = ["Room B"]
        data2["teachers"] = ["Prof. Gauss"]
        data2["td_tags"] = ["TD99"]
        data2["departments"] = ["PHYS"]

        insert_list_record([self.base_data, data2])

        self.assertEqual(InsaClass.objects.count(), 2)
        self.assertEqual(Room.objects.count(), 2)
        self.assertEqual(Teacher.objects.count(), 2)
        self.assertEqual(GroupTD.objects.count(), 2)
        self.assertEqual(Department.objects.count(), 2)

    def test_no_duplicate_related_objects(self):
        insert_list_record([self.base_data])
        insert_list_record([self.base_data])  # Same input again

        self.assertEqual(Teacher.objects.count(), 1)
        self.assertEqual(Room.objects.count(), 1)
        self.assertEqual(GroupTD.objects.count(), 1)
        self.assertEqual(Department.objects.count(), 1)
