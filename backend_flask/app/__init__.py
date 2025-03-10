"""
Module Name: __init__.py

Description:
    The factory for the app

Author:
    Raphael Senellart

Date Created:
    January 22, 2025

Version:
    1.0.1

License:
    No License

Usage:
    NOT DONE YET

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""

import json
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from itsdangerous import URLSafeSerializer

db= SQLAlchemy()

from .utils import *
from .models import *


def create_app(test_config=None):
    """The factory for the app,
    create the basic app and initialize the login manager, mail manager
    and serializer and the blueprints

    
    Keyword arguments:
    test_config -- if given create a test version of the app for development
    Return: the app
    """

    app = Flask(__name__)

    # load the instance config, if it exists, when not testing
    if test_config is None:
        config_file_name = "config.json"
    else:
        config_file_name = "test_config.json"

    with open(config_file_name, encoding='utf8') as json_file:
        config_json = json.load(json_file)
        for k, v in config_json.items():
            app.config[k] = v


    #initialize the login manager from Flask
    from .models import User

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'# set the login view to the one defined in auth.py
    login_manager.login_message = "Vous avez besoin d'être connecté pour accéder à cette page"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)# use the primary key of the User database as the user_id


    # utilities
    global serializer
    serializer = URLSafeSerializer(app.config['URL_SERIALIZER_SECRET'], salt="chpassword")

    global mail
    mail = Mail(app)

    #initialize the database
    db.init_app(app)


    from .blueprints.auth import auth as auth_blueprint
    from .blueprints.api import api as api_blueprint
    from .blueprints.admin import admin as admin_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(api_blueprint)
    app.register_blueprint(admin_blueprint)


    return app