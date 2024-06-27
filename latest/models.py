# Models.py for flask
from flask_login import UserMixin
from sqlalchemy.sql import func

from db import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    is_admin = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())




