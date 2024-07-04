from io import BytesIO

import pandas as pd
from flask import (Blueprint, Response, flash, jsonify, redirect,
                   render_template, request, send_file, url_for)
from flask_login import current_user, login_required, login_user
from werkzeug.security import generate_password_hash

from db import db
from models import Medicines, PatientMedicines, Patients, Users, Wards
from user_graphs import main

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
    users = Users.query.all()
    columns = Users.__table__.columns
    columns = [column.name for column in columns]
    return render_template('admin/users.html', users=users, plot_types=PLOTS, columns=columns, table_name='Users')

@admin.route('/user/create', methods=['GET', 'POST'])
@login_required
def create_user():
    if request.method == 'POST':
        username = request.form['username']
        if Users.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('admin.create_user'))
        password = request.form['password']
        password = generate_password_hash(password)
        is_admin = request.form.get('is_admin', False)
        if is_admin:
            is_admin = True
        user = Users(username=username, password=password, is_admin=is_admin)
        db.session.add(user)
        db.session.commit()
        flash('User created successfully', 'success')
        return redirect(url_for('admin.users'))
    return render_template('admin/create_user.html')


@admin.route('/user/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update_user(id):
    user = Users.query.get(id)
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password = generate_password_hash(password)
        is_admin = request.form.get('is_admin', False)
        if is_admin:
            is_admin = True
        if user.username != username and Users.query.filter_by(username=username).first():
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
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully', 'success')
    return redirect(url_for('admin.users'))

@admin.route('/login_as_user/<int:id>')
@login_required
def login_as_user(id):
    user = Users.query.get(id)
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
        return redirect(url_for('admin.users'))
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
    tables = ['Users', 'Patients', 'Wards', 'Medicines', 'PatientMedicines']
    
    table_data = {}
    for table_name in tables:
        model_class = globals()[table_name]
        table_entries = model_class.query.all()
        table_columns = model_class.__table__.columns
        column_names = [column.name.replace('_', ' ').capitalize() for column in table_columns]
        column_details = model_class.__table__.columns.keys()
        
        table_data[table_name] = {
            'entries': table_entries,
            'columns': column_names,
            'details': column_details
        }

    return render_template('admin/tables.html', table_data=table_data, tables=tables)



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

@admin.route('/medicine_patients/<int:id>')
@login_required
def medicine_patients(id):
    patients = PatientMedicines.query.filter_by(medicine_id=id).all()
    patient_ids = [patient.id for patient in patients]
    medicine = Medicines.query.get(id)
    columns = Patients.__table__.columns
    values = []
    for patient_id in patient_ids:
        patient = Patients.query.get(patient_id)
        print(patient)
        values.append([getattr(patient, column.name) for column in columns])

    return render_template('admin/medicines/medicine_patients.html', patients=patients, medicine=medicine, columns=columns, values=values)



@admin.route('/wards', methods=['GET', 'POST'])
@login_required
def wards():
    wards = Wards.query.all()
    columns = Wards.__table__.columns
    columns = [column.name for column in columns]
    return render_template('admin/wards/wards.html', wards=wards,  plot_types=PLOTS, columns=columns, table_name='Wards')

@admin.route('/ward/create', methods=['GET', 'POST'])
@login_required
def create_ward():
    if request.method == 'POST':
        name = request.form['name']
        ward = Wards(name=name)
        db.session.add(ward)
        db.session.commit()
        flash('Ward created successfully', 'success')
        return redirect(url_for('admin.wards'))
    return render_template('admin/wards/create_ward.html')

@admin.route('/ward/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update_ward(id):
    ward = Wards.query.get(id)
    if request.method == 'POST':
        name = request.form['name']
        ward.name = name
        db.session.commit()
        flash('Ward updated successfully', 'success')
        return redirect(url_for('admin.wards'))
    return render_template('admin/wards/update_ward.html', ward=ward)

@admin.route('/ward/delete/<int:id>')
@login_required
def delete_ward(id):
    ward = Wards.query.get(id)
    db.session.delete(ward)
    db.session.commit()
    flash('Ward deleted successfully', 'success')
    return redirect(url_for('admin.wards'))

@admin.route('/ward_patients/<int:id>')
@login_required
def ward_patients(id):
    ward = Wards.query.get(id)
    patients = ward.patients
    columns = Patients.__table__.columns
    values = []
    for patient in patients:
        values.append([getattr(patient, column.name) for column in columns])
    print(values)
    return render_template('admin/wards/ward_patients.html', patients=patients, ward=ward, columns=columns, values=values)

@admin.route('/patients', methods=['GET', 'POST'])
@login_required
def patients():
    patients = Patients.query.all()
    columns = Patients.__table__.columns
    columns = [column.name for column in columns]
    return render_template('admin/patients/patients.html', patients=patients,  plot_types=PLOTS, columns=columns, table_name='Patients')

@admin.route('/patient/create_patient', methods=['GET', 'POST'])
@login_required
def create_patient():
    wards = Wards.query.all()
    if request.method == 'POST':
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        father_name = request.form['father_name']
        age = request.form['age']
        date_created = request.form['date_created']
        phone = request.form['phone']
        cnic = request.form['cnic']
        ward_id = request.form['ward']
        mrn = request.form['mrn']
        gender = request.form['gender']


        if Patients.query.filter_by(mrn=mrn).first():
            flash('Patient with same MRN already exists', 'danger')
            return redirect(url_for('admin.create_patient'))
        if ward_id == '':
            flash('Please select a ward', 'danger')
            return redirect(url_for('admin.create_patient'))
        date_created = pd.to_datetime(date_created).date()

        patient = Patients(
            first_name=first_name,
            last_name=last_name,
            father_name=father_name,
            age=age,
            date_created=date_created,
            phone=phone,
            cnic=cnic,
            ward_id=ward_id,
            mrn=mrn,
            gender=gender)
        db.session.add(patient)
        db.session.commit()
        flash('Patient created successfully', 'success')
    return render_template('admin/patients/create_patient.html', wards=wards)

@admin.route('/patient/<int:id>/update', methods=['GET', 'POST'])
@login_required
def update_patient(id):
    patient = Patients.query.get(id)
    wards = Wards.query.all()
    if request.method == 'POST':
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        father_name = request.form['father_name']
        age = request.form['age']
        date_created = request.form['date_created']
        phone = request.form['phone']
        cnic = request.form['cnic']
        ward_id = request.form['ward']
        mrn = request.form['mrn']

        if Patients.query.filter_by(mrn=mrn).first() and Patients.query.filter_by(mrn=mrn).first().id != id:
            flash('Patient with same MRN already exists', 'danger')
            return redirect(url_for('admin.update_patient', id=id))
        date_created = pd.to_datetime(date_created).date()

        patient.first_name = first_name
        patient.last_name = last_name
        patient.father_name = father_name
        patient.age = age
        patient.date_created = date_created
        patient.phone = phone
        patient.cnic = cnic
        patient.ward_id = ward_id
        patient.mrn = mrn
        db.session.commit()
        flash('Patient updated successfully', 'success')
        return redirect(url_for('admin.patients'))
    return render_template('admin/patients/update_patient.html', patient=patient, wards=wards)
        
@admin.route('/patient/delete/<int:id>')
@login_required
def delete_patient(id):
    patient = Patients.query.get(id)
    db.session.delete(patient)
    db.session.commit()
    flash('Patient deleted successfully', 'success')
    return redirect(url_for('admin.patients'))

