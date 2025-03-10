"""
Module Name: db_insertion.py

Description:
    The insert methods for the database

Author:
    Raphael Senellart

Date Created:
    January 22, 2025

Version:
    1.0.0

License:
    No License

Usage:
    should be called by a main module every once in a while to refresh the database

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""
import datetime
from flask import flash
from tqdm import tqdm

from sqlalchemy.exc import IntegrityError 
from ..models import *

def insert_list_record(session, list_of_records):
    """
    ###insert_list_record :
    Insert the list of records (in this case fetched from insa.agenda)
    following the pattern : \n
    [(date, start_hour, end_hour, description, room_list, teacher_list,
      tdgroup_list, department_list), (...), ...]

    It is done by checking the existence of the record in the database and inserting it if necessary

    :param session: The current app session where the given records will be inserted
    :param list_of_records: The list of record to be inserted

    """
    for record in tqdm(list_of_records):
        insert_record_in_db(session, record)


def insert_record_in_db(session, record):
    """
    ### insert_record_in_db :
    Insert a single record in the given session
    following the pattern : \n
    (date, start_hour, end_hour, description, room_list,
      teacher_list, tdgroup_list, department_list)

    It is done by checking the existence of the record in the database and inserting it if necessary
    :param session: The current app session where the given record will be inserted
    :param record: The record to be inserted

    """
    date, start_hour, end_hour, desc = record[:4]
    room_list, teacher_list, td_list, depart_list = record[4:]
    
    list_name_tables = [(room_list, Room), (teacher_list, Teacher), (td_list, GroupTD), (depart_list, Department)]

    new_class = insert_class_in_db(session, date, start_hour, end_hour, desc)

    # SHOULD PROBABLY ONLY BE DONE ONCE IN A WHILE, NOT AT EVERY FETCH

    for list_table, table in list_name_tables:
        for name in list_table:
            insert_single_name_in_db(session, name, table)


    # Insert ClassLink records to link InsaClass with associated entities
    for name in teacher_list:
        insert_classlink_teacher_in_db(session, new_class, name)

    for name in room_list:
        insert_classlink_room_in_db(session, new_class, name)

    for name in depart_list:
        insert_classlink_depart_in_db(session, new_class, name)

    for name in td_list:
        insert_classlink_td_in_db(session, new_class, name)



def insert_class_in_db(session, date, start_hour, end_hour, desc):
    """ function for inserting record in class table"""
    converted_date = list(map(lambda x: int(x), date.split('-')))
    converted_start_hour = list(map(lambda x: int(x), start_hour.split(':')))
    converted_end_hour = list(map(lambda x: int(x), end_hour.split(':')))


    exists = session.query(InsaClass).filter_by(
        date=datetime.date(converted_date[0], converted_date[1], converted_date[2]),
        start_hour=datetime.time(converted_start_hour[0],converted_start_hour[1],\
                                 converted_start_hour[2]),
        end_hour=datetime.time(converted_end_hour[0],converted_end_hour[1],\
                               converted_end_hour[2]),
        desc=desc
    ).first()

    new_class = InsaClass(
        date=datetime.date(converted_date[0], converted_date[1], converted_date[2]),
        start_hour=datetime.time(converted_start_hour[0],converted_start_hour[1],\
                                 converted_start_hour[2]),
        end_hour=datetime.time(converted_end_hour[0],converted_end_hour[1],\
                               converted_end_hour[2]),
        desc=desc
    )
    if insert_generic_in_db(session, exists, new_class):
        return new_class
    return InsaClass()

def insert_enum_color_in_db(session, value, user_value):
    """ function for inserting record in color of association table"""
    exists = session.query(EnumColor).filter_by(
        value=value,
    ).first()

    new_class = EnumColor(
        value=value,
        user_friendly_value = user_value
    )
    insert_generic_in_db(session, exists, new_class)
    

def insert_classlink_depart_in_db(session, insa_class_object, name):
    """ function for inserting link in link table between department and class tables"""

    linked_entity = session.query(Department).filter_by(name=name).first()
    if linked_entity:
        exists = session.query(ClassLinkDepart).filter_by(
            class_id = insa_class_object.id,
            depart_id=name
        ).first()

        class_link = ClassLinkDepart(
            insa_class = insa_class_object,
            depart=linked_entity
        )

        insert_generic_in_db(session, exists, class_link)
    else :
        print(f"Couldnt create link because {name} if not found in Department")

def insert_classlink_td_in_db(session, insa_class_object, name):
    """ function for inserting link in link table between td and class tables"""

    linked_entity = session.query(GroupTD).filter_by(name=name).first()
    if linked_entity:
        exists = session.query(ClassLinkTD).filter_by(
            class_id = insa_class_object.id,
            td_id=name  # Check the td_id field (GroupTD name)
        ).first()

        class_link = ClassLinkTD(
            insa_class = insa_class_object,
            td=linked_entity
        )

        insert_generic_in_db(session, exists, class_link)
    else :
        print(f"Couldnt create link because {name} if not found in GroupTD")

def insert_classlink_room_in_db(session, insa_class_object, name):
    """ function for inserting link in link table between room and class tables"""

    linked_entity = session.query(Room).filter_by(name=name).first()
    if linked_entity:
        exists = session.query(ClassLinkRoom).filter_by(
            class_id = insa_class_object.id,
            room_id = name
        ).first()

        class_link = ClassLinkRoom(
            insa_class = insa_class_object,
            room = linked_entity
        )

        insert_generic_in_db(session, exists, class_link)
    else :
        print(f"Couldnt create link because {name} if not found in Room")

def insert_classlink_teacher_in_db(session, insa_class_object, name):
    """ function for inserting link in link table between teacher and class tables"""

    linked_entity = session.query(Teacher).filter_by(name=name).first()
    if linked_entity:
        exists = session.query(ClassLinkTeacher).filter_by(
            class_id = insa_class_object.id,
            teacher_id = name
        ).first()

        class_link = ClassLinkTeacher(
            insa_class = insa_class_object,
            teacher = linked_entity
        )

        insert_generic_in_db(session, exists, class_link)
    else :
        print(f"Couldnt create link because {name} if not found in Teacher")



def insert_generic_in_db(session, exists, new_class):
    """
    ### insert_generic_in_db:
    Method use by the others inserting methods in update_db\n
    Tries to insert in the database and if it create an Integrity error
    rollsback the database to the given instance

    :param session: The current app session where the given record will be inserted
    :param exists:  A boolean given (typically a session.query to know if a record already exist)
    :param new_class: The transformed_record created by the calling methods

    """
    if not exists:
        try:
            session.add(new_class)
            session.commit()
            #flash("Inserted successfully.")
        except IntegrityError:
            session.rollback()
            #flash("Failed to insert due to integrity constraints.")
            return False

        #flash("Record already exists. No insertion performed.")

    return True

def insert_association_in_db(name, user_email, color_value, type, sector):
    """function for inserting association in db"""
    linked_user = User.query.filter_by(email=user_email).first()
    linked_color = EnumColor.query.filter_by(value=color_value).first()
    linked_type = EnumType.query.filter_by(name=type).first()
    linked_sector = EnumSector.query.filter_by(name=sector).first()
    if linked_color and linked_sector and linked_type and linked_user:
        exists = Association.query.filter_by(name=name).first()
        exists_user = Association.query.filter_by(user_email= user_email).first()
        if not(exists):
            if not(exists_user):
                new_association = Association(
                    name=name,
                    user_email=user_email,
                    unique_color=color_value,
                    type=type,
                    sector=sector
                )
                db.session.add(new_association)
                db.session.commit()
                flash("Association created successfully!", "success")
            else:
                flash("user already associated with another association!", "danger")
        else:
            flash("Association already exists!", "danger")
    else:
        flash("Invalid foreign key reference!", "danger")

def insert_single_name_in_db(session, name, table):
    exists = session.query(table).filter_by(
        name=name,
    ).first()

    new_class = table(
        name=name,
    )
    insert_generic_in_db(session, exists, new_class)
