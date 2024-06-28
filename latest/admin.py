from io import BytesIO

import pandas as pd
from flask import (Blueprint, Response, flash, jsonify, redirect,
                   render_template, request, send_file, url_for)
from flask_login import current_user, login_required, login_user
from werkzeug.security import generate_password_hash

from db import db
from models import Medicines, Patients, User, Wards
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
    columns = User.__table__.columns
    columns = [column.name for column in columns]
    return render_template('admin/users.html', users=users, plot_types=PLOTS, columns=columns, table_name='User')

@admin.route('/user/create', methods=['GET', 'POST'])
@login_required
def create_user():
    if request.method == 'POST':
        username = request.form['username']
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('admin.create_user'))
        password = request.form['password']
        password = generate_password_hash(password)
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
        password = generate_password_hash(password)
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

@admin.route('/login_as_user/<int:id>')
@login_required
def login_as_user(id):
    user = User.query.get(id)
    login_user(user)
    return redirect(url_for('views.home'))

@admin.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        password = request.form['password']
        password = generate_password_hash(password)
        current_user.password = password
        db.session.commit()
        flash('Password changed successfully', 'success')
        return redirect(url_for('admin.panel'))
    return render_template('admin/change_password.html', user=current_user)

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
        table_name = request.form['table_name']

        if x==y:
            flash('X and Y axis must be different', 'error')
            return redirect(url_for('admin.generate_plot'))

        html = main(x=x, y=y, type_p=type_p, table_name=table_name)
        return jsonify({
            'title': f'{type_p.capitalize()} Plot: {x} vs {y}',
            'html': html
        })

@admin.route('/tables')
@login_required
def tables():
    users = User.query.all()
    return render_template('admin/tables.html', users=users)



@admin.route('/download_json/<table_name>')
@login_required
def download_json(table_name):
    model = globals().get(table_name)
    if not model:
        return redirect(url_for('admin.tables'))

    data = []
    for item in model.query.all():
        item_data = {column.name: getattr(item, column.name) for column in item.__table__.columns}
        data.append(item_data)

    return send_json(data, f'{table_name}.json')

@admin.route('/download_excel/<table_name>')
@login_required
def download_excel(table_name):
    model = globals().get(table_name)
    if not model:
        return redirect(url_for('admin.tables'))

    data = []
    for item in model.query.all():
        item_data = {column.name: getattr(item, column.name) for column in item.__table__.columns}
        data.append(item_data)

    return send_excel(data, f'{table_name}.xlsx')

def send_json(data, filename):
    df = pd.DataFrame(data)
    json_data = df.to_json(orient='records')
    return Response(
        json_data,
        mimetype='application/json',
        headers={'Content-Disposition': f'attachment;filename={filename}'}
    )

def send_excel(data, filename):
    df = pd.DataFrame(data)
    output = BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='Sheet1')
    writer.close()
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=filename
    )

@admin.route('/medicines', methods=['GET', 'POST'])
@login_required
def medicines():
    medicines = Medicines.query.all()
    columns = Medicines.__table__.columns
    columns = [column.name for column in columns]
    return render_template('admin/medicines/medicines.html', medicines=medicines,  plot_types=PLOTS, columns=columns, table_name='Medicines')

@admin.route('/medicine/create', methods=['GET', 'POST'])
@login_required
def create_medicine():
    if request.method == 'POST':
        name = request.form['name']
        medicine = Medicines(name=name)
        db.session.add(medicine)
        db.session.commit()
        flash('Medicine created successfully', 'success')
        return redirect(url_for('admin.medicines'))
    return render_template('admin/medicines/create_medicine.html')

@admin.route('/medicine/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update_medicine(id):
    medicine = Medicines.query.get(id)
    if request.method == 'POST':
        name = request.form['name']
        medicine.name = name
        db.session.commit()
        flash('Medicine updated successfully', 'success')
        return redirect(url_for('admin.medicines'))
    return render_template('admin/medicines/update_medicine.html', medicine=medicine)

@admin.route('/medicine/delete/<int:id>')
@login_required
def delete_medicine(id):
    medicine = Medicines.query.get(id)
    db.session.delete(medicine)
    db.session.commit()
    flash('Medicine deleted successfully', 'success')
    return redirect(url_for('admin.medicines'))
