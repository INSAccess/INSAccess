"""
Module Name: db_insertor.py

Description:
    The methods for inserting the given records into the 
    database

Author:
    Raphael Senellart

Date Created:
    April 6, 2025

Version:
    1.0.0

License:
    No License

Usage:


Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""
from tqdm import tqdm
from core.models import *
from django.db import transaction

# @transaction.atomic
def insert_list_record(list_of_records):
    """
    Inserts or updates InsaClass records from a given list.
    
    - Deletes records that no longer exist in the source.
    - Updates records if the sequence number has changed.
    - Inserts new records.
    
    Parameters:
        list_of_records (list of dict): Each dict should contain keys:
            uid, time_stamp, time_start, time_end, desc, time_created,
            time_last_modified, sequence, room_list, teachers, td_tags, departments.
    """

    #1 delete every event that does not exist anymore:
    valid_uids = [record["uid"] for record in list_of_records]
    InsaClass.objects.exclude(uid__in=valid_uids).delete()
    
    #2 we update every event that has a different sequence number than the original
    for record in tqdm(list_of_records):
        existing_class = InsaClass.objects.filter(uid = record["uid"]).first()
        new_class = InsaClass(
                uid = record["uid"],
                time_stamp = record["time_stamp"],
                start_hour = record["time_start"],
                end_hour = record["time_end"],
                date = record["date"],
                desc = record["desc"],
                time_created = record["time_created"],
                time_last_modified = record["time_last_modified"],
                sequence = record["sequence"]
                )
        if not existing_class or existing_class.sequence != record["sequence"]:
            if existing_class:
                existing_class.delete()
            new_class.save()

            for name in record["teachers"]:
                insert_classlink_teacher_in_db(new_class, name)

            for name in record["locations"]:
                insert_classlink_room_in_db(new_class, name)

            for name in record["departments"]:
                insert_classlink_depart_in_db(new_class, name)

            for name in record["td_tags"]:
                insert_classlink_td_in_db(new_class, name)

        # third case is that there is no change then when dont do anything

def insert_single_name_in_db(name, table):
    """ Insert into tables that have only a 'name' field """
    table.objects.get_or_create(name=name)


def insert_association_in_db(name, user_email, color_value, type, sector):
    """ Insert an association into the database """
    linked_user = User.objects.filter(email=user_email).first()
    linked_color = EnumColor.objects.filter(value=color_value).first()
    linked_type = EnumType.objects.filter(name=type).first()
    linked_sector = EnumSector.objects.filter(name=sector).first()

    if linked_color and linked_sector and linked_type and linked_user:
        exists = Association.objects.filter(name=name).first()
        exists_user = Association.objects.filter(user_email=user_email).first()

        if not exists:
            if not exists_user:
                new_association = Association(
                    name = name,
                    user_email = user_email,
                    unique_color = color_value,
                    type = type,
                    sector = sector
                )
                new_association.save()
                print("Association created successfully!")
            else:
                print("User already associated with another association!")
        else:
            print("Association already exists!")
    else:
        print("Invalid foreign key reference!")



def insert_classlink_depart_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkDepart between Department and InsaClass """
    linked_entity, _ = Department.objects.get_or_create(name=name)
    class_link = ClassLinkDepart(
        insa_class = insa_class_object,
        depart = linked_entity
    )

    class_link.save()

def insert_classlink_td_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkTD between GroupTD and InsaClass """
    linked_entity, _ = GroupTD.objects.get_or_create(name=name)

    class_link = ClassLinkTD(
        insa_class = insa_class_object,
        td = linked_entity
    )
    class_link.save()

def insert_classlink_room_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkRoom between Room and InsaClass """
    linked_entity, _ = Room.objects.get_or_create(name=name)

    class_link = ClassLinkRoom(
        insa_class = insa_class_object,
        room = linked_entity
    )
    class_link.save()


def insert_classlink_teacher_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkTeacher between Teacher and InsaClass """
    linked_entity, _ = Teacher.objects.get_or_create(name=name)
    class_link = ClassLinkTeacher(
        insa_class = insa_class_object,
        teacher = linked_entity
    )
    class_link.save()

