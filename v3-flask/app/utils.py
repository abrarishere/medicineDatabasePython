import os
from datetime import datetime, timedelta
from random import choice, randint
from flask import redirect, url_for, abort
from flask_login import current_user
from functools import wraps

from .db import db
from .models import Medicine, Patient, PatientMedicine, Ward


def load_env_file(file_path='.env'):
    '''
    Load environment variables from a .env
    '''
    if os.path.exists(file_path):
        with open(file_path) as f:
            for line in f:
                # Skip empty lines and comments
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip().strip('"').strip("'")



def add_random_medicines(num=10):
    for _ in range(num):
        medicine_name = f"Medicine_{randint(1000, 9999)}"
        quantity = randint(1, 100)
        medicine = Medicine(medicine_name=medicine_name, quantity=quantity)
        db.session.add(medicine)
    db.session.commit()

def add_random_wards(num=5):
    for _ in range(num):
        ward_name = f"Ward_{randint(100, 999)}"
        ward = Ward(ward_name=ward_name, created_at=datetime.now())
        db.session.add(ward)
    db.session.commit()

def add_random_patients(num=20):
    wards = Ward.query.all()
    for _ in range(num):
        mr_number = f"{randint(1000000000000, 9999999999999)}"
        name = f"Patient_{randint(100, 999)}"
        father_name = f"Father_{randint(100, 999)}"
        gender = choice(['Male', 'Female', 'Other'])
        age = randint(1, 100)
        ward = choice(wards)
        phone_number = f"{randint(1000000000, 9999999999)}"
        patient = Patient(
            mr_number=mr_number, name=name, father_name=father_name, 
            gender=gender, age=age, ward_id=ward.id, 
            phone_number=phone_number, created_at=datetime.now(), 
            updated_at=datetime.now()
        )
        db.session.add(patient)
    db.session.commit()

def add_random_patient_medicines(num=30):
    patients = Patient.query.all()
    medicines = Medicine.query.all()
    for _ in range(num):
        patient = choice(patients)
        medicine = choice(medicines)
        quantity = randint(1, 10)
        date = datetime.now() - timedelta(days=randint(1, 365))
        patient_medicine = PatientMedicine(
            mr_number=patient.mr_number, medicine_id=medicine.id, 
            quantity=quantity, date=date
        )
        db.session.add(patient_medicine)
    db.session.commit()

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('auth.login'))  # Redirect to the login page if the user is not logged in
        elif not current_user.is_admin:
            return abort(403)  # Return a 403 Forbidden error if the user is not an admin
        return f(*args, **kwargs)
    return decorated_function
