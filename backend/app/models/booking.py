import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, Date, ForeignKey, Uuid, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    item_id = Column(Uuid, ForeignKey("items.id"))
    renter_id = Column(Uuid, ForeignKey("users.id"))
    owner_id = Column(Uuid, ForeignKey("users.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    num_days = Column(Integer, nullable=True)
    duration_hours = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)
    deposit = Column(Integer, default=500)
    status = Column(String(50), default="pending") # pending, confirmed, picked_up, in_use, returned, completed
    pickup_time = Column(DateTime(timezone=True), nullable=True)
    delivery_time = Column(DateTime(timezone=True), nullable=True)
    return_pickup_time = Column(DateTime(timezone=True), nullable=True)
    return_delivery_time = Column(DateTime(timezone=True), nullable=True)
    delivery_address = Column(Text, nullable=True)
    renter_name = Column(String(255), nullable=True)
    renter_phone = Column(String(20), nullable=True)
    payment_status = Column(String(50), default="pending") # paid, pending, cash_on_delivery
    payment_method = Column(String(50), nullable=True)
    delivery_type = Column(String(50), default="standard") # standard, premium
    pickup_required = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    item = relationship("Item", backref="bookings")
    renter = relationship("User", foreign_keys=[renter_id], backref="rentals")
    owner = relationship("User", foreign_keys=[owner_id], backref="owner_bookings")
