from datetime import datetime, timedelta
from random import choice, randint

from flask import Blueprint, flash, redirect, render_template, request, url_for

from app import db

from .db import db
from .models import Medicine, Patient, PatientMedicine, Ward

base_bp = Blueprint('base', __name__)


@base_bp.route('/')
def index():
    '''
    Display the index page.
    '''
    print("Database populated with random data.")
    return render_template('index.html')

