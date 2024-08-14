from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required

base = Blueprint('base', __name__)

@base.route('/')
@login_required
def index():
    return render_template('index.html')

