"""
Module Name: models.py

Description:
    The models for the mariadb database

Author:
    Raphael Senellart

Date Created:
    January 22, 2025

Version:
    1.0.0

License:
    No License

Usage:
    should be called by init_db

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""

from flask_login import UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy import Date, Time
import uuid

from . import db

class User(UserMixin, db.Model):
    """User definition, inherit from UserMixin for authentication """
    __tablename__ = 'user'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))    # user information
    email = db.Column(db.String(100), unique = True, nullable = False)
    password = db.Column(db.String(255),nullable = False)
    name = db.Column(db.String(100))
    # admin field
    admin = db.Column(db.Boolean, default = False)

    link_td = db.relationship("UserLinkTD", back_populates = "link_group_td")


class Event(db.Model):
    """ Generic Class for defining evenement in calendar"""
    __abstract__= True
    
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    date = db.Column(Date, nullable = False)
    start_hour = db.Column(Time)
    end_hour = db.Column(Time)
    desc = db.Column(db.String(255))



class InsaClass(Event):
    """INSA Class definition,to store class from insa"""
    __tablename__ = 'insa_class'

    link_room = db.relationship("ClassLinkRoom", back_populates = "insa_class")
    link_td = db.relationship("ClassLinkTD", back_populates = "insa_class")
    link_teacher = db.relationship("ClassLinkTeacher", back_populates = "insa_class")
    link_depart = db.relationship("ClassLinkDepart", back_populates = "insa_class")

class InsaEvenement(Event):
    """INSA Event definition to store custom event from insa"""
    __tablename__ = 'insa_evenement'
    
    associated_link = db.Column(db.String(510))
    association_id = db.Column(ForeignKey("association.name"), nullable = False)
    
    evenement_link_evenement_room = db.relationship("EvenementLinkEventRoom", back_populates = "insa_evenement")



class Association(db.Model):
    """ the association profile for the club and association of INSA Rouen """
    __tablename__ = 'association'
    
    name = db.Column(db.String(255), primary_key = True)
    user_email = db.Column(ForeignKey("user.email"))
    unique_color = db.Column(ForeignKey('enum_color.value'), nullable = False)
    type = db.Column(ForeignKey('enum_type.name'), nullable = False)
    sector = db.Column(ForeignKey('enum_sector.name'), nullable = False)
    

class EnumType(db.Model):
    """ the possible value for the type in association """
    __tablename__ = 'enum_type'
    name = db.Column(db.String(255), primary_key= True)

class EnumSector(db.Model):
    """ the possible value for the sector (sport, music ...) in association """
    __tablename__ = 'enum_sector'
    name = db.Column(db.String(255), primary_key= True)

class EnumColor(db.Model):
    """ the possible value for the color of the association """
    __tablename__ = 'enum_color'
    value = db.Column(db.String(255), primary_key= True)
    user_friendly_name = db.Column(db.String(255))
    
class GroupTD(db.Model):
    """ GroupTD definition """
    __tablename__ = 'td_group'
    name = db.Column(db.String(100), primary_key = True)

class Department(db.Model):
    """ Department definition """
    __tablename__ = 'department'
    name = db.Column(db.String(100), primary_key = True)


class Teacher(db.Model):
    """ Teacher definition"""
    __tablename__ = 'teacher'
    name = db.Column(db.String(255), primary_key = True)

class Room(db.Model):
    """ Room definition"""
    __tablename__ = 'room'
    name = db.Column(db.String(100), primary_key = True)

class EvenementRoom(db.Model):
    """ Special room for event definition"""
    __tablename__ = 'evenement_room'
    name = db.Column(db.String(100), primary_key = True)

class EvenementLinkEventRoom(db.Model):
    """ 1 to Many link between classINSA and Room tables"""
    __tablename__ = 'evenement_link_evenement_room'

    evenement_id = db.Column(db.Integer, ForeignKey('insa_evenement.id'), primary_key = True)
    insa_evenement = db.relationship("InsaEvenement", back_populates="evenement_link_evenement_room")

    room_id = db.Column(ForeignKey('evenement_room.name'), primary_key = True)
    room = db.relationship("EvenementRoom")

class ClassLinkTD(db.Model):
    """ 1 to Many link between classINSA and TD tables"""
    __tablename__ = 'class_link_td'

    class_id = db.Column(db.Integer, ForeignKey('insa_class.id'), primary_key = True)
    insa_class = db.relationship("InsaClass", back_populates="link_td")

    td_id = db.Column(ForeignKey('td_group.name'), primary_key = True)
    td = db.relationship("GroupTD")

class ClassLinkRoom(db.Model):
    """ 1 to Many link between classINSA and Room tables"""
    __tablename__ = 'class_link_room'

    class_id = db.Column(db.Integer, ForeignKey('insa_class.id'), primary_key = True)
    insa_class = db.relationship("InsaClass", back_populates="link_room")

    room_id = db.Column(ForeignKey('room.name'), primary_key = True)
    room = db.relationship("Room")

class ClassLinkTeacher(db.Model):
    """ 1 to Many link between classINSA and Teacher tables"""
    __tablename__ = 'class_link_teacher'

    class_id = db.Column(db.Integer, ForeignKey('insa_class.id'), primary_key = True)
    insa_class = db.relationship("InsaClass", back_populates="link_teacher")

    teacher_id = db.Column(ForeignKey('teacher.name'), primary_key = True)
    teacher = db.relationship("Teacher")

class ClassLinkDepart(db.Model):
    """ 1 to Many link between classINSA and Department tables"""
    __tablename__ = 'class_link_depart'

    class_id = db.Column(db.Integer, ForeignKey('insa_class.id'), primary_key = True)
    insa_class = db.relationship("InsaClass", back_populates="link_depart")

    depart_id = db.Column(ForeignKey('department.name'), primary_key = True)
    depart = db.relationship("Department")

class UserLinkTD(db.Model):
    """ 1 to Many link between classINSA and Department tables"""
    __tablename__ = 'user_link_td'

    user_id = db.Column(db.String(36), ForeignKey('user.id'), primary_key = True)
    link_group_td = db.relationship("User", back_populates="link_td")

    name_td = db.Column(db.String(100), ForeignKey('td_group.name'), primary_key = True)
    depart = db.relationship("GroupTD")
