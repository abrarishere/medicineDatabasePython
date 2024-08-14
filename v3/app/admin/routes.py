
from flask import (Blueprint, Flask, flash, redirect, render_template, request,
                   url_for)
from flask_login import login_user

admin = Blueprint("admin", __name__)

@admin.route("/")
def index():
    """
    Display the admin dashboard.
    """
    return render_template("admin/index.html")
