import time
from datetime import datetime, timedelta

from sqlalchemy import update
from sqlalchemy.orm import scoped_session, sessionmaker

from db import db
from models import User


def status(app):
    with app.app_context():
        Session = sessionmaker(bind=db.engine)
        scoped_session_factory = scoped_session(Session)

        while True:
            session = scoped_session_factory()
            try:
                for user in session.query(User).all():
                    # Update last_seen to current time
                    user.last_seen = datetime.now()
                    session.add(user)
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error updating last_seen: {e}")
            finally:
                session.close()
            time.sleep(10)

def update_status(app):
    with app.app_context():
        Session = sessionmaker(bind=db.engine)
        scoped_session_factory = scoped_session(Session)

        while True:
            session = scoped_session_factory()
            try:
                # Define a threshold for what "recent" activity means
                threshold = datetime.now() - timedelta(minutes=5)

                for user in session.query(User).all():
                    if user.last_seen >= threshold:
                        # User is considered online
                        user.status = 'online'
                    else:
                        # User is considered offline
                        user.status = 'offline'

                    # Update last_seen to current time
                    user.last_seen = datetime.now()

                    # Store activity time in a list (example: activity_times)
                    if not user.activity_times:
                        user.activity_times = [datetime.now()]
                    else:
                        user.activity_times.append(datetime.now())

                    session.add(user)
                session.commit()
            except Exception as e:
                session.rollback()
                print(f"Error updating status: {e}")
            finally:
                session.close()
            time.sleep(10)
