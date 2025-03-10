"""
Module Name: token.py

Description:
    The methods for creating and using token
    ,and sending emails

Author:
    Raphael Senellart

Date Created:
    February 3, 2025

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
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from flask import current_app

from .. import mail




def generate_token(values):
    """return the serialized token"""
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.dumps(values, salt=current_app.config["SECURITY_PASSWORD_SALT"])


def confirm_token(token, expiration=3600):
    """de-serialize the given token if the expiration time is still valid"""
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        values = serializer.loads(
            token, salt=current_app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
        return values
    except Exception:
        return False


def send_email(to, subject, template):
    """send an email """
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=current_app.config["MAIL_DEFAULT_SENDER"],
    )
    mail.send(msg)
