"""
Module Name: test_insertion.py

Description:
    A basic call of the update_db to see if it works correctly

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
from werkzeug.security import generate_password_hash

from app.models import User
from app import db, create_app
from app.utils.db_insertion import insert_list_record
from app.utils.fetch import fetch_entire_year


with create_app().app_context():

    db.create_all()

    with open("data/users.txt", encoding="utf8") as f:
        for line in f:
            if not line.startswith("#") or line.startswith('\n'):
                (email, name) = line.strip().split("|")
                user = User.query.filter_by(email=email).first()
                if not user:
                    db.session.add(User(email=email,
                                        name=name,
                                        password=generate_password_hash("toto123")))
    db.session.commit()

    list_of_records = fetch_entire_year("2024", "ITI", "3")
    insert_list_record(db.session, list_of_records)


