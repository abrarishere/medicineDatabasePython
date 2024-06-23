from flask import Blueprint, render_template, request, redirect, url_for, flash
from db import db
from models import User, MedicineList, AddPatient, PatientMedicine
from datetime import datetime
from flask_login import login_user, logout_user, login_required

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
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
                return redirect(url_for('main.admin'))
            return redirect(url_for('main.index'))
        else:
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
    return render_template('admin.html', users=User.query.all(), medicines=MedicineList.query.all(), patients=AddPatient.query.all(), patient_medicines=PatientMedicine.query.all())

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
        name = request.form['name']
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
