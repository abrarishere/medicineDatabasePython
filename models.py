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
    ward_id = db.Column(db.Integer, db.ForeignKey('wards.name'), nullable=False)
    # We have to get the all medicines of the patient
    medicines = db.relationship('MedicineList', secondary='patient_medicine', backref=db.backref('patients', lazy='dynamic'))
    # We have created the relationship between the patient and the medicine list and patient_medicine table bjt we have not created the patient_medicine table yet


    def __repr__(self):
        return '<AddPatient %r>' % self.name

# This is the table that will store the relationship between the patient and the medicine list
class PatientMedicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('add_patient.id'))
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine_list.id'))

    def __repr__(self):
        return '<PatientMedicine %r>' % self.name

