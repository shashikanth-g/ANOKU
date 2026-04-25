from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.user import User

class ItemBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    condition: Optional[str] = None
    material: Optional[str] = None
    daily_price: int
    weekly_price: Optional[int] = None
    monthly_price: Optional[int] = None
    photos: Optional[List[str]] = []

class ItemCreate(ItemBase):
    owner_id: UUID

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    daily_price: Optional[int] = None
    status: Optional[str] = None
    photos: Optional[List[str]] = None

class Item(ItemBase):
    id: UUID
    owner_id: UUID
    status: str
    times_rented: int
    rating: float
    created_at: datetime
    owner: Optional[User] = None

    class Config:
        from_attributes = True
