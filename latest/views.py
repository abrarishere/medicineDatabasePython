from flask import (Blueprint, Flask, flash, redirect, render_template, request,
                   url_for)
from flask_login import current_user, login_required, login_user, logout_user
from flask_sqlalchemy import SQLAlchemy

from db import db
from models import User

views = Blueprint('views', __name__)

@views.route('/')
@views.route('/home')
@login_required
def home():
    return render_template('index.html')


@views.route('/admin')
@login_required
def admin():
    if current_user.is_admin:
        return render_template('admin/panel.html')
    else:
        return redirect(url_for('views.home'))

def create_admin():
    if User.query.filter_by(username='admin').first():
        return
    username='admin'
    password='admin'
    is_admin=True
    user = User(username=username, password=password, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()


