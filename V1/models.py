from datetime import datetime
from db import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<User %r>' % self.username

class MedicineList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<MedicineList %r>' % self.name

class Wards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<Wards %r>' % self.name

class AddPatient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    father_name = db.Column(db.String(80), nullable=True)
    mrn_number = db.Column(db.Integer, nullable=False, unique=True)
    gender = db.Column(db.String(80), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    phone_number = db.Column(db.Integer, nullable=True)
    cnic = db.Column(db.String(80), nullable=True)
    ward_id = db.Column(db.Integer, db.ForeignKey('wards.id'), nullable=False)
    medicines = db.relationship('MedicineList', secondary='patient_medicine', backref=db.backref('patients', lazy='dynamic'))

    def __repr__(self):
        return '<AddPatient %r>' % self.first_name

class PatientMedicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('add_patient.id'), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine_list.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    medicine = db.relationship('MedicineList', backref=db.backref('patient_medicine', lazy='dynamic'))
    patient = db.relationship('AddPatient', backref=db.backref('patient_medicine', lazy='dynamic'))

    def __repr__(self):
        return '<PatientMedicine %r>' % self.id
