from datetime import datetime

from db import db
from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user
from models import AddPatient, MedicineList, PatientMedicine, User, Wards

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('index.html')


@main_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            login_user(user)
            flash('You have been logged in!', 'success')
            if user.username == 'admin':
                user.is_admin = True
                return redirect(url_for('main.admin'))
            return redirect(url_for('main.index'))
        flash('Login failed', 'danger')
    return render_template('login.html')

@main_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@main_blueprint.route('/admin' , methods=['GET', 'POST'])
@login_required
def admin():
    return render_template('admin.html', users=User.query.all(), medicines=MedicineList.query.all(), wards=Wards.query.all(), patients=AddPatient.query.all())

@main_blueprint.route('/create_account', methods=['GET', 'POST'])
def create_account():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User(username=username, password=password)
        db.session.add(user)
        db.session.commit()
        flash('Account created!', 'success')
        return redirect(url_for('main.create_account'))
    return render_template('create_account.html')


@main_blueprint.route('/update_account/<int:id>', methods=['GET', 'POST'])
def update_account(id):
    user = User.query.get(id)
    if request.method == 'POST':
        user.username = request.form['username']
        user.password = request.form['password']
        db.session.commit()
        flash('Account updated!', 'success')
        return redirect(url_for('main.admin'))
    return render_template('update_account.html', user=user)


@main_blueprint.route('/delete_account/<int:id>')
def delete_account(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    flash('Account deleted!', 'success')
    return redirect(url_for('main.admin'))

@main_blueprint.route('/add_medicine', methods=['GET', 'POST'])
def add_medicine():
    if request.method == 'POST':
        name = request.form.get('name')
        medicine = MedicineList(name=name)
        db.session.add(medicine)
        db.session.commit()
        flash('Medicine added!', 'success')
        return redirect(url_for('main.add_medicine'))
    return render_template('add_medicine.html')

@main_blueprint.route('/update_medicine/<int:id>', methods=['GET', 'POST'])
def update_medicine(id):
    medicine = MedicineList.query.get(id)
    if request.method == 'POST':
        medicine.name = request.form['name']
        db.session.commit()
        flash('Medicine updated!', 'success')
        return redirect(url_for('main.admin'))
    return render_template('update_medicine.html', medicine=medicine)

@main_blueprint.route('/delete_medicine/<int:id>')
def delete_medicine(id):
    medicine = MedicineList.query.get(id)
    db.session.delete(medicine)
    db.session.commit()
    flash('Medicine deleted!', 'success')
    return redirect(url_for('main.admin'))


@main_blueprint.route('/add_ward', methods=['GET', 'POST'])
def add_ward():

# pylint: disable=duplicate-code
    if request.method == 'POST':
        name = request.form['name']
        ward = Wards(name=name)
        db.session.add(ward)
        db.session.commit()
        flash('Ward added!', 'success')
        return redirect(url_for('main.add_ward'))
    return render_template('add_ward.html')
# pylint: enable=duplicate-code

@main_blueprint.route('/update_ward/<int:id>', methods=['GET', 'POST'])
def update_ward(id):
    ward = Wards.query.get(id)
    if request.method == 'POST':
        ward.name = request.form['name']
        db.session.commit()
        flash('Ward updated!', 'success')
        return redirect(url_for('main.admin'))
    return render_template('update_ward.html', ward=ward)

@main_blueprint.route('/delete_ward/<int:id>')
def delete_ward(id):
    ward = Wards.query.get(id)
    db.session.delete(ward)
    db.session.commit()
    flash('Ward deleted!', 'success')
    return redirect(url_for('main.admin'))

@main_blueprint.route('/add_patient', methods=['GET', 'POST'])
def add_patient():
    if request.method == 'POST':
        age = request.form['age']
        father_name = request.form['father_name']
        mrn_number = request.form['mrn_number']
        cnic = request.form['cnic']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        phone_number = request.form['phone_number']
        ward_id = request.form['ward']
        date = datetime.utcnow()
        patient = AddPatient(age=age, father_name=father_name, mrn_number=mrn_number, cnic=cnic, first_name=first_name, last_name=last_name, phone_number=phone_number, ward_id=ward_id, date=date)
        db.session.add(patient)
        db.session.commit()
        flash('Patient added!', 'success')
        return redirect(url_for('main.add_patient'))
    return render_template('add_patient.html', wards=Wards.query.all())

@main_blueprint.route('/update_patient/<int:id>', methods=['GET', 'POST'])
def update_patient(id):
    patient = AddPatient.query.get(id)
    if request.method == 'POST':
        patient.age = request.form['age']
        patient.father_name = request.form['father_name']
        patient.mrn_number = request.form['mrn_number']
        patient.cnic = request.form['cnic']
        patient.first_name = request.form['first_name']
        patient.last_name = request.form['last_name']
        patient.phone_number = request.form['phone_number']
        patient.ward_id = request.form['ward']
        db.session.commit()
        flash('Patient updated!', 'success')
        return redirect(url_for('main.admin'))
    return render_template('update_patient.html', patient=patient, wards=Wards.query.all())

@main_blueprint.route('/delete_patient/<int:id>')
def delete_patient(id):
    patient = AddPatient.query.get(id)
    db.session.delete(patient)
    db.session.commit()
    flash('Patient deleted!', 'success')
    return redirect(url_for('main.admin'))



@main_blueprint.route('/get_patient', methods=['POST'])
@login_required
def get_patient():
    mrn_number = request.form['mrn_number']
    patient = AddPatient.query.filter_by(mrn_number=mrn_number).first()
    if patient:
        return render_template('patient_medicine.html', patient=patient, medicines=MedicineList.query.all(), ward=Wards.query.get(patient.ward_id))
    flash('Patient not found', 'danger')
    return redirect(url_for('main.index'))


@main_blueprint.route('/add_medicine_to_patient', methods=['POST'])
@login_required
def add_medicine_to_patient():
    patient_id = request.form['patient_id']
    medicine_id = request.form['medicine']
    quantity = request.form['quantity']

    try:
        quantity = int(quantity)
    except ValueError:
        flash('Invalid quantity provided', 'error')
        return redirect(url_for('main.get_patient'))

    patient = AddPatient.query.get(patient_id)
    medicine = MedicineList.query.get(medicine_id)

    if not patient or not medicine:
        flash('Invalid patient or medicine ID', 'error')
        return redirect(url_for('main.get_patient'))

    patient_medicine = PatientMedicine.query.filter_by(patient_id=patient_id, medicine_id=medicine_id).first()

    if patient_medicine:
        patient_medicine.quantity += quantity
    else:
        patient_medicine = PatientMedicine(patient_id=patient_id, medicine_id=medicine_id, quantity=quantity)
        db.session.add(patient_medicine)

    db.session.commit()
    flash('Medicine added to patient!', 'success')
    return redirect(url_for('main.get_patient', mrn_number=patient.mrn_number))


@main_blueprint.route('/delete_medicine_from_patient/<int:patient_id>/<int:medicine_id>', methods=['POST'])
@login_required
def delete_medicine_from_patient(patient_id, medicine_id):
    patient_medicine = PatientMedicine.query.filter_by(patient_id=patient_id, medicine_id=medicine_id).first()
    
    if patient_medicine:
        db.session.delete(patient_medicine)
        db.session.commit()
        flash('Medicine deleted from patient!', 'success')
    else:
        flash('Medicine not found for the patient!', 'error')
    
    patient = AddPatient.query.get(patient_id)
    return redirect(url_for('main.get_patient', mrn_number=patient.mrn_number))



@main_blueprint.route('/get_ward_patients', methods=['POST'])
@login_required
def get_ward_patients():
    ward_id = request.form['ward_id']
    ward = Wards.query.get(ward_id)
    if not ward:
        flash('Invalid ward ID', 'error')
        return redirect(url_for('main.index'))
    patients = AddPatient.query.filter_by(ward_id=ward_id).all()
    return render_template('ward_patients.html', patients=patients, ward=ward)
