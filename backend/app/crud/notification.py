from sqlalchemy.orm import Session
from uuid import UUID
from app.models.notification import Notification

def create_notification(db: Session, user_id: UUID, message: str):
    db_notification = Notification(user_id=user_id, message=message)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
