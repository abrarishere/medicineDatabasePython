from flask import render_template, Blueprint, request, flash, redirect, url_for, Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_user, login_required, current_user, logout_user
from models import User

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('index.html')

@views.route('/login', methods=['GET', 'POST'])
def login():
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

@views.route('/admin')
@login_required
def admin():
    if current_user.is_admin:
        return render_template('admin.html')
    else:
        return redirect(url_for('views.home'))
