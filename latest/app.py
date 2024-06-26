from flask import Flask
from flask_login import LoginManager
from views import views
from db import db


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SECRET_KEY'] = 'secret'

    app.register_blueprint(views, url_prefix='/')


    # login_manager = LoginManager()
    # login_manager.login_view = 'views.login'
    # login_manager.init_app(app)


    with app.app_context():
        db.init_app(app)
        db.create_all()

    return app


app= create_app()

if __name__ == '__main__':
    app.run(debug=True)
