import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, CheckConstraint, Uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    booking_id = Column(Uuid, ForeignKey("bookings.id"))
    reviewer_id = Column(Uuid, ForeignKey("users.id"))
    reviewed_user_id = Column(Uuid, ForeignKey("users.id"))
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    booking = relationship("Booking", backref="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewed_user = relationship("User", foreign_keys=[reviewed_user_id])
