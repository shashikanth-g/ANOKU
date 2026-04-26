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
    deposit: Optional[int] = None
    delivery_address: Optional[str] = None
    renter_name: Optional[str] = None
    renter_phone: Optional[str] = None
    payment_status: Optional[str] = "pending"
    payment_method: Optional[str] = None
    delivery_type: Optional[str] = "standard"
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    pickup_required: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None
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
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    delivery_type: Optional[str] = None
    pickup_required: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

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
