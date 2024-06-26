import time
from datetime import datetime

from sqlalchemy import update
from sqlalchemy.orm import scoped_session

from db import db
from models import User


def status():
    while True:
        session = scoped_session(db.session)
        try:
            for user in session.query(User).all():
                session.execute(
                    update(User)
                    .where(User.id == user.id)
                    .values(last_seen=datetime.now())
                )
            session.commit()
        finally:
            session.remove()
        time.sleep(10)

def update_status():
    while True:
        session = scoped_session(db.session)
        try:
            for user in session.query(User).all():
                session.execute(
                    update(User)
                    .where(User.id == user.id)
                    .values(status='online')
                )
            session.commit()
        finally:
            session.remove()
        time.sleep(10)
