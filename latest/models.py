
import datetime

from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.sql.schema import ForeignKey

from db import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    is_admin = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())

class Patients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    father_name = db.Column(db.String(150), nullable=True)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(150), nullable=True)
    mrn = db.Column(db.String(150), nullable=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    phone = db.Column(db.String(150), nullable=True)
    cnic = db.Column(db.String(150), nullable=True)
    ward_id = db.Column(db.Integer, ForeignKey('wards.id'), nullable=False)

class Wards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    patients = db.relationship('Patients', backref='ward', lazy=True)
    patients_length = db.Column(db.Integer, default=0)


class Medicines(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())

