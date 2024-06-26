from flask import (Blueprint, Flask, flash, redirect, render_template, request,
                   url_for)
from flask_login import current_user, login_required, login_user, logout_user
from flask_sqlalchemy import SQLAlchemy

from db import db
from models import User
from views import views, create_admin

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    create_admin()
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user:
            if user.password == password:
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
                if username == 'admin':
                    user.is_admin = True
                    return redirect(url_for('views.admin'))
                else:
                    return redirect(url_for('views.home'))
                    
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Username does not exist.', category='error')

    return render_template('login.html')



@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))
