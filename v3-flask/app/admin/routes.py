
from flask import Blueprint, flash, redirect, render_template, request, url_for

from app.db import db
from app.models import Medicine, Patient, PatientMedicine, Ward
from app.utils import admin_required

admin = Blueprint("admin", __name__)

@admin.route("/")
@admin_required
def index():
    """
    Display the admin dashboard.
    """
    return render_template("admin/index.html")

@admin.route('/patients', methods=['GET', 'POST'])
def patients():
    return render_template('admin/patients.html')


@admin.route('/wards', methods=['GET', 'POST'])
def wards():
    wards = Ward.query.all()
    patients = Patient.query.all()
    if request.method == 'POST':
        ward_name = request.form.get('name')
        ward = Ward(ward_name=ward_name)
        db.session.add(ward)
        db.session.commit()
        flash(f'Ward {ward_name} added successfully.', 'success')
        return redirect(url_for('admin.wards'))
    return render_template('admin/wards.html', wards=wards, patients=patients)

def get_columns(model):
    return model.__table__.columns
    
