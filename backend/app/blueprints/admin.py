"""
Module Name: admin.py

Description:
    The blueprint for all special management route
    accessed only by admin

Author:
    Raphael Senellart

Date Created:
    January 30, 2025

Version:
    1.0.0

License:
    No License

Usage:
    should be initialized in the app factory
    and is used by the flask server

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""
from flask import Blueprint, jsonify, render_template, request, flash, redirect, url_for
from flask_login import login_required

from ..utils.db_insertion import insert_association_in_db
from ..models import *

from ..utils.decorator import admin_required

admin = Blueprint('admin', __name__,url_prefix='/admin/')


@admin.route('/create_association', methods=['POST'])
@login_required
@admin_required
def create_association():
    """post route for registering the association"""
    name = request.form['name']
    user_email = request.form['user_email']
    unique_color = request.form['unique_color']
    type = request.form['type']
    sector = request.form['sector']

    insert_association_in_db(name,user_email,unique_color,type,sector)

    return redirect(url_for('admin.root'))

@admin.route('/', methods=['GET'])
@login_required
@admin_required
def root():
    """get route for rendering template of the assocation creating"""
    # Fetching dropdown options from database
    colors = EnumColor.query.all()
    types = EnumType.query.all()
    sectors = EnumSector.query.all()
    return render_template('admin.html', colors=colors, types=types, sectors=sectors)


@admin.route('/add_type',methods =["POST"])
@login_required
@admin_required
def add_type():
    name = request.form.get('type_name')
    
    exist = EnumType.query.filter_by(name = name).first()
    
    if not exist:
        type = EnumType(name = name)
        db.session.add(type)
        db.session.commit()
    else :
        flash("already exist")
        return redirect(url_for('admin.root'))
    flash("added successfully")
    return redirect(url_for('admin.root'))

@admin.route('/add_sector',methods =["POST"])
@login_required
@admin_required
def add_sector():
    name = request.form.get('sector_name')
    
    exist = EnumSector.query.filter_by(name = name).first()
    
    if not exist:
        type = EnumSector(name = name)
        db.session.add(type)
        db.session.commit()
    else :
        flash("already exist")
        return redirect(url_for('admin.root'))
    flash("added successfully")
    return redirect(url_for('admin.root'))
