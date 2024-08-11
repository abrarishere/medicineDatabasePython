import os

from flask import Flask

from app.utils import load_env_file

from .db import db
from .routes import base_bp


def create_app():
    '''
    Create a Flask app and configure it with the values from the .env file.
    '''
    app = Flask(__name__)

    load_env_file()
    for key in ['SECRET_KEY', 'DEBUG', 'PORT', 'SQLALCHEMY_DATABASE_URI']:
        app.config[key] = os.getenv(key)

    app.register_blueprint(base_bp)

    db.init_app(app)


    return app
