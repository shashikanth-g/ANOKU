import uuid
from sqlalchemy import Column, String, Boolean, Float, Integer, Text, DateTime, Uuid
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    phone = Column(String(15), unique=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    role = Column(String(50), default="renter") # renter, owner, admin
    profile_photo_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    address = Column(Text, nullable=True)
    bank_account = Column(String(255), nullable=True)
    upi_id = Column(String(255), nullable=True)
    kyc_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
