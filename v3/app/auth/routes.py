from flask import (Blueprint, Flask, flash, redirect, render_template, request,
                   url_for)
from flask_bcrypt import check_password_hash, generate_password_hash
from flask_login import login_user, logout_user

from app.auth.models import User
from app.db import db

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():
    """
    Display the login page and process the login form.
    """
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        # Check by email or username
        email_user = User.query.filter_by(email=email).first()
        username_user = User.query.filter_by(username=email).first()
        if email_user or username_user:
            user = email_user if email_user else username_user
            if check_password_hash(user.password, password):
                login_user(user)
                if user.is_admin:
                    return redirect(url_for("admin.index"))
                return redirect(url_for("home.index"))
        flash("Invalid email or password", "error")
    return render_template("auth/login.html")

def createAdmin():
    email = "legendabrar44@gmail.com"
    username = "admin"
    password = "admin"
    is_admin = True
    user = User.query.filter_by(email=email).first()
    if user:
        return
    user = User.query.filter_by(username=username).first()
    if user:
        return
    user = User(email=email, username=username, password=generate_password_hash(password), is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    return

@auth.route("/logout")
def logout():
    """
    Log the user out.
    """
    logout_user()
    return redirect(url_for("auth.login"))
