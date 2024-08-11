from flask_sqlalchemy import SQLAlchemy

# Create a SQLAlchemy object to be used in the app.
# It is created separately to avoid circular imports and to allow the db object to be used in other modules.
db = SQLAlchemy()
