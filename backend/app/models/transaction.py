import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    booking_id = Column(Uuid, ForeignKey("bookings.id"))
    renter_id = Column(Uuid, ForeignKey("users.id"))
    owner_id = Column(Uuid, ForeignKey("users.id"))
    amount = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False) # rental, deposit, refund, penalty
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    status = Column(String(50), default="pending") # pending, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    booking = relationship("Booking", backref="transactions")
    renter = relationship("User", foreign_keys=[renter_id])
    owner = relationship("User", foreign_keys=[owner_id])
