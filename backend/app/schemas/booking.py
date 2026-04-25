from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class BookingBase(BaseModel):
    item_id: UUID
    start_date: date
    end_date: date
    num_days: Optional[int] = None
    duration_hours: int
    total_price: int
    deposit: int = 500
    delivery_address: Optional[str] = None
    renter_name: Optional[str] = None
    renter_phone: Optional[str] = None
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    renter_id: UUID
    owner_id: UUID

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    return_pickup_time: Optional[datetime] = None
    return_delivery_time: Optional[datetime] = None

from app.schemas.item import Item

class Booking(BookingBase):
    id: UUID
    renter_id: UUID
    owner_id: UUID
    status: str
    created_at: datetime
    item: Optional[Item] = None

    class Config:
        from_attributes = True
