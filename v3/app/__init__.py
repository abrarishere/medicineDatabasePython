import os

from flask import Flask
from flask_login import LoginManager

from app.admin.routes import admin
from app.auth.models import User
from app.auth.routes import auth
from app.db import db
from app.models import Medicine, Patient, PatientMedicine, Ward
from app.routes import base
from app.utils import load_env_file


def create_app():
    '''
    Create a Flask app and configure it with the values from the .env file.
    '''
    app = Flask(__name__)

    load_env_file()
    for key in ['SECRET_KEY', 'DEBUG', 'PORT', 'SQLALCHEMY_DATABASE_URI']:
        app.config[key] = os.getenv(key)

    app.register_blueprint(base, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(admin, url_prefix='/admin')
    
    login_manager = LoginManager()



    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    with app.app_context():
        db.init_app(app)
        db.create_all()


    return app
