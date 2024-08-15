from datetime import datetime
from .db import db

class Medicine(db.Model):
    '''
    Model for the medicines table of all the medicines available in the hospital.
    '''
    __tablename__ = 'medicines'

    id = db.Column(db.Integer, primary_key=True)
    medicine_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, default=None)

    def __repr__(self):
        return f'<Medicine {self.medicine_name}>'


class Patient(db.Model):
    '''
    Model for the patients table of all the patients in the hospital with their details.
    '''
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    mr_number = db.Column(db.String(13), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    father_name = db.Column(db.String(100), default=None)
    gender = db.Column(db.Enum('Male', 'Female', 'Other'), default=None)
    age = db.Column(db.Integer, default=None)
    ward_id = db.Column(db.Integer, db.ForeignKey('wards.id'), nullable=False)
    phone_number = db.Column(db.String(20), default=None)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    # Relationship to Ward
    ward = db.relationship('Ward', back_populates='patients')
    # Relationship to PatientMedicine
    medicines = db.relationship('PatientMedicine', back_populates='patient')

    def __repr__(self):
        return f'<Patient {self.name}>'


class PatientMedicine(db.Model):
    '''
    Model for the patient_medicines table of all the medicines prescribed to the patients.
    '''
    __tablename__ = 'patient_medicines'

    mr_number = db.Column(db.String(13), db.ForeignKey('patients.mr_number'), primary_key=True)
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id'), primary_key=True)
    quantity = db.Column(db.Integer, default=None)
    date = db.Column(db.Date, primary_key=True)

    # Relationships
    patient = db.relationship('Patient', back_populates='medicines')
    medicine = db.relationship('Medicine')

    def __repr__(self):
        return f'<PatientMedicine {self.mr_number} - {self.medicine_id}>'


class Ward(db.Model):
    '''
    Model for the wards table of all the wards in the hospital.
    '''
    __tablename__ = 'wards'

    id = db.Column(db.Integer, primary_key=True)
    ward_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.Date, nullable=False, default=datetime.now())

    # Relationship to Patient
    patients = db.relationship('Patient', back_populates='ward')

    def __repr__(self):
        return f'<Ward {self.ward_name}>'
