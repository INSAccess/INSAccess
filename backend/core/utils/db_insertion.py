"""
Module Name: db_insertion.py

Description:
    The methods for inserting the given records into the 
    database

Author:
    Raphael Senellart

Date Created:
    March 26, 2025

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
import datetime
from django.db import IntegrityError
from tqdm import tqdm
from core.models import *

def insert_list_record(list_of_records):
    """
    ### insert_list_record :
    Insert the list of records (in this case fetched from insa.agenda)
    following the pattern:
    [(date, start_hour, end_hour, description, room_list, teacher_list,
      tdgroup_list, department_list), (...), ...]

    It is done by checking the existence of the record in the database and inserting it if necessary
    :param list_of_records: The list of record to be inserted
    """
    for record in tqdm(list_of_records):
        insert_record_in_db(record)


def insert_record_in_db(record):
    """
    ### insert_record_in_db :
    Insert a single record in the database
    following the pattern: 
    (date, start_hour, end_hour, description, room_list,
      teacher_list, tdgroup_list, department_list)

    It is done by checking the existence of the record in the database and inserting it if necessary
    :param record: The record to be inserted
    """
    uid, date, start_hour, end_hour, desc = record[:5]
    room_list, teacher_list, td_list, depart_list = record[5:]
    
    list_name_tables = [(room_list, Room), (teacher_list, Teacher), (td_list, GroupTD), (depart_list, Department)]

    new_class = insert_class_in_db(uid, date, start_hour, end_hour, desc)

    new_class.save()

    for list_table, table in list_name_tables:
        for name in list_table:
            insert_single_name_in_db(name, table)

    # Insert ClassLink records to link InsaClass with associated entities
    for name in teacher_list:
        insert_classlink_teacher_in_db(new_class, name)

    for name in room_list:
        insert_classlink_room_in_db(new_class, name)

    for name in depart_list:
        insert_classlink_depart_in_db(new_class, name)

    for name in td_list:
        insert_classlink_td_in_db(new_class, name)


def insert_class_in_db(uid, date, start_hour, end_hour, desc):
    """ Insert a class record into the database """
    converted_date = list(map(lambda x: int(x), date.split('-')))
    converted_start_hour = list(map(lambda x: int(x), start_hour.split(':')))
    converted_end_hour = list(map(lambda x: int(x), end_hour.split(':')))

    exists = InsaClass.objects.filter(
        uid = uid
    ).first()

    new_class = InsaClass(
        uid = uid,
        date = datetime.date(converted_date[0], converted_date[1], converted_date[2]),
        start_hour = datetime.time(converted_start_hour[0], converted_start_hour[1], converted_start_hour[2]),
        end_hour = datetime.time(converted_end_hour[0], converted_end_hour[1], converted_end_hour[2]),
        desc = desc
    )

    insert_generic_in_db(exists, new_class)
    return new_class


def insert_classlink_depart_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkDepart between Department and InsaClass """
    linked_entity = Department.objects.filter(name=name).first()
    if linked_entity:
        exists = ClassLinkDepart.objects.filter(
            insa_class = insa_class_object.uid,
            depart = name
        ).first()

        class_link = ClassLinkDepart(
            insa_class = insa_class_object,
            depart = linked_entity
        )

        insert_generic_in_db(exists, class_link)
    else:
        print(f"Could not create link because {name} is not found in Department")


def insert_classlink_td_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkTD between GroupTD and InsaClass """
    linked_entity = GroupTD.objects.filter(name=name).first()
    if linked_entity:
        exists = ClassLinkTD.objects.filter(
            insa_class = insa_class_object.uid,
            td = name
        ).first()

        class_link = ClassLinkTD(
            insa_class = insa_class_object,
            td = linked_entity
        )

        insert_generic_in_db(exists, class_link)
    else:
        print(f"Could not create link because {name} is not found in GroupTD")


def insert_classlink_room_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkRoom between Room and InsaClass """
    linked_entity = Room.objects.filter(name=name).first()
    if linked_entity:
        exists = ClassLinkRoom.objects.filter(
            insa_class = insa_class_object.uid,
            room = name
        ).first()

        class_link = ClassLinkRoom(
            insa_class = insa_class_object,
            room = linked_entity
        )

        insert_generic_in_db(exists, class_link)
    else:
        print(f"Could not create link because {name} is not found in Room")


def insert_classlink_teacher_in_db(insa_class_object, name):
    """ Insert a link in ClassLinkTeacher between Teacher and InsaClass """
    linked_entity = Teacher.objects.filter(name=name).first()
    if linked_entity:
        exists = ClassLinkTeacher.objects.filter(
            insa_class = insa_class_object.uid,
            teacher_id = name
        ).first()

        class_link = ClassLinkTeacher(
            insa_class = insa_class_object,
            teacher = linked_entity
        )

        insert_generic_in_db(exists, class_link)
    else:
        print(f"Could not create link because {name} is not found in Teacher")


def insert_generic_in_db(exists, new_class):
    """
    Insert a record into the database if it does not already exist
    :param exists: A boolean (typically a query to check if the record already exists)
    :param new_class: The instance to be inserted into the database
    """
    if not exists:
        try:
            new_class.save()
        except IntegrityError:
            print("Failed to insert due to integrity constraints.")
            return False

    return True


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


def insert_single_name_in_db(name, table):
    """ Insert into tables that have only a 'name' field """
    exists = table.objects.filter(name=name).first()

    new_instance = table(
        name = name,
    )
    insert_generic_in_db(exists, new_instance)
