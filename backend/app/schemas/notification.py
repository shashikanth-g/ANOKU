from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class NotificationBase(BaseModel):
    message: str

class NotificationCreate(NotificationBase):
    user_id: UUID

class Notification(NotificationBase):
    id: UUID
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
