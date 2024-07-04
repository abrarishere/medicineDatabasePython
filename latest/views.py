from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash

from db import db
from models import Medicines, PatientMedicines, Patients, Users

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
    medicines = Medicines.query.all()
    return redirect(url_for('views.home'), medicines=medicines)


def create_admin():
    if Users.query.filter_by(username='admin').first():
        print('admin is ')
        return
    username='admin'
    password='admin'
    password = generate_password_hash(password)
    is_admin=True
    user = Users(username=username, password=password, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    print('admin done')

@views.route('/search_patient', methods=['GET', 'POST'])
@login_required
def search_patient():
    medicines = Medicines.query.all()
    if request.method == 'POST':
        mrn = request.form.get('mrn')
        patient = Patients.query.filter_by(mrn=mrn).first()
        print(patient, mrn)
        return render_template('add_medicine.html', patient=patient, medicines=medicines)

@views.route('/add_medicine', methods=['GET', 'POST'])
@login_required
def add_medicine():
    if request.method == 'POST':
        medicine_name = request.form.get('name')
        patient_id = request.form.get('patient_id')
        quantity = request.form.get('quantity')
        increase = request.form.get('increase')

        if increase:
            patient_medicine = PatientMedicines.query.filter_by(patient_id=patient_id, medicine_id=medicine_name).first()
            patient_medicine.quantity += 1
            db.session.commit()
            flash('Medicine added successfully', category='success')
            return redirect(url_for('views.home'))

        # if PatientMedicines.query.filter_by(patient_id=patient_id, medicine_id=medicine_name).first():
        #     patient_medicine = PatientMedicines.query.filter_by(patient_id=patient_id, medicine_id=medicine_name).first()
        #     patient_medicine.quantity += 1
        #     db.session.commit()
        #     flash('Medicine added successfully', category='success')
        #     return redirect(url_for('views.home'))

        patient_medicine = PatientMedicines(patient_id=patient_id, medicine_id=medicine_name, quantity=quantity)
        db.session.add(patient_medicine)
        db.session.commit()
        flash('Medicine added successfully', category='success')
        return redirect(url_for('views.home'))
