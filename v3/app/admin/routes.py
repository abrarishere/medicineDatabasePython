
from flask import Blueprint, flash, redirect, render_template, request, url_for

from app.db import db
from app.utils import admin_required

admin = Blueprint("admin", __name__)

@admin.route("/")
@admin_required
def index():
    """
    Display the admin dashboard.
    """
    return render_template("admin/index.html")


@admin.route("/create_ward", methods=["GET", "POST"])
def create_ward():
    """
    Display the create ward form and process the form.
    """
    if request.method == "POST":
        name = request.form["name"]
        capacity = request.form["capacity"]
        ward = Ward(name=name, capacity=capacity)
        db.session.add(ward)
        db.session.commit()
        flash("Ward created successfully", "success")
        return redirect(url_for("admin.index"))
    return render_template("admin/index.html")
