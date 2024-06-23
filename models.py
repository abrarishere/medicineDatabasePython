from datetime import datetime
from db import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

class MedicineList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<MedicineList %r>' % self.name

class AddPatient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    father_name = db.Column(db.String(80), nullable=True)
    mrn_number = db.Column(db.Integer, nullable=False, unique=True)
    gender = db.Column(db.String(80), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    phone = db.Column(db.Integer, nullable=True)
    cnic = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        return '<AddPatient %r>' % self.name

class PatientMedicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine_list.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    patient_mr_number = db.Column(db.Integer, db.ForeignKey('add_patient.mrn_number'), nullable=False)

    def __repr__(self):
        return '<PatientMedicine %r>' % self.medicine_id
