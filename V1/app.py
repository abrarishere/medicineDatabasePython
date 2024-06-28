from flask import Flask
from db import db
from views import main_blueprint
from flask_login import LoginManager
from models import User

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
    app.config['SECRET_KEY'] = 'secret'
    db.init_app(app)
    login_manager = LoginManager()
    login_manager.login_view = 'main.login'

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    with app.app_context():
        db.create_all()
        print('Database initialized!')

    app.register_blueprint(main_blueprint)

    
    @app.errorhandler(405)
    def method_not_allowed(e):
        return '''<h1><a href='/''>you have to go</a></h1>''', 405
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=3000)
