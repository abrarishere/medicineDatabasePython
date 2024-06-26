from threading import Thread
from flask import Flask
from flask_login import LoginManager
from admin import admin
from auth import auth
from db import db
from models import User
from status import status, update_status
from views import views

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SECRET_KEY'] = 'secret'

    db.init_app(app)

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(admin, url_prefix='/admin')

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    Thread(target=status).start()
    Thread(target=update_status).start()
    app.run(debug=True)
