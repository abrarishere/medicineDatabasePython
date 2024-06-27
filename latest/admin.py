from flask import (Blueprint, Flask, flash, jsonify, redirect, render_template,
                   request, url_for)
from flask_login import current_user, login_required, login_user, logout_user

from db import db
from models import User
from user_graphs import main
from views import views

admin = Blueprint('admin', __name__)


PLOTS = [
    'line',
    'bar',
    'scatter',
    'pie',
    'hist',
    'box',
    'violin',
]

@admin.route('/users')
@login_required
def users():
    users = User.query.all()
    return render_template('admin/users.html', users=users, plot_types=PLOTS)

@admin.route('/user/create', methods=['GET', 'POST'])
@login_required
def create_user():
    if request.method == 'POST':
        username = request.form['username']
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('admin.create_user'))
        password = request.form['password']
        is_admin = request.form.get('is_admin', False)
        if is_admin:
            is_admin = True
        user = User(username=username, password=password, is_admin=is_admin)
        db.session.add(user)
        db.session.commit()
        flash('User created successfully', 'success')
        return redirect(url_for('admin.users'))
    return render_template('admin/create_user.html')


@admin.route('/user/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update_user(id):
    user = User.query.get(id)
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        is_admin = request.form.get('is_admin', False)
        if is_admin:
            is_admin = True
        if user.username != username and User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('admin.update_user', id=id))
        user.username = username
        user.password = password
        user.is_admin = is_admin
        db.session.commit()
        flash('User updated successfully', 'success')
        return redirect(url_for('admin.users'))
    return render_template('admin/update_user.html', user=user)

@admin.route('/user/delete/<int:id>')
@login_required
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully', 'success')
    return redirect(url_for('admin.users'))

@admin.route('/panel')
@login_required
def panel():
    return render_template('admin/panel.html')


@admin.route('/generate_plot', methods=['GET', 'POST'])
@login_required
def generate_plot():
    if request.method == 'POST':
        x = request.form['x_axis']
        y = request.form['y_axis']
        type_p = request.form['plot_type']
        print(f'Received form data - x: {x}, y: {y}, type: {type_p}')
        html = main(x=x, y=y, type_p=type_p)
        return jsonify({
            'title': f'{type_p.capitalize()} Plot: {x} vs {y}',
            'html': html
        })
