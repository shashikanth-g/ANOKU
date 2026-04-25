import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Uuid, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class DamageReport(Base):
    __tablename__ = "damage_reports"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    booking_id = Column(Uuid, ForeignKey("bookings.id"))
    reported_by_id = Column(Uuid, ForeignKey("users.id"))
    damage_description = Column(Text, nullable=False)
    damage_photos = Column(JSON, nullable=True) # array of photo URLs
    severity = Column(String(50), nullable=True) # minor, moderate, major
    compensation_amount = Column(Integer, nullable=True)
    status = Column(String(50), default="pending") # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    booking = relationship("Booking", backref="damage_reports")
    reported_by = relationship("User", foreign_keys=[reported_by_id])
