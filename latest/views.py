from flask import Blueprint, redirect, render_template, url_for
from flask_login import current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash

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
    return redirect(url_for('views.home'))

def create_admin():
    if User.query.filter_by(username='admin').first():
        print('admin is ')
        return
    username='admin'
    password='admin'
    password = generate_password_hash(password)
    is_admin=True
    user = User(username=username, password=password, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    print('admin done')


