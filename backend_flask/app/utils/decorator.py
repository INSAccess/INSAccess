"""
Module Name: decorator.py

Description:
    some custom decorator for the web app

Author:
    Raphael Senellart

Date Created:
    February 2, 2025

Version:
    1.0.0

License:
    No License

Usage:
    

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
"""
from functools import wraps

from flask import flash, redirect, url_for
from flask_login import current_user


def logout_required(func):
    """ the decorator for routes where the user shouldnt be logged"""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated:
            flash("vous êtes deja connecté")
            redirect(url_for('auth.login'))
            return redirect("http://localhost:3000", code=302)
        return func(*args, **kwargs)

    return decorated_function

def admin_required(func):
    """ the decorator for routes where the user should be an admin"""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if not current_user.admin:
            flash("non.")
            return redirect("http://localhost:3000", code=302)
        return func(*args, **kwargs)

    return decorated_function