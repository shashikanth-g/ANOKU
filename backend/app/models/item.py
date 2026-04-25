import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Float, Uuid, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    owner_id = Column(Uuid, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)
    condition = Column(String(50), nullable=True)
    material = Column(String(100), nullable=True)
    daily_price = Column(Integer, nullable=False)
    weekly_price = Column(Integer, nullable=True)
    monthly_price = Column(Integer, nullable=True)
    status = Column(String(50), default="available") # available, rented, cleaning
    photos = Column(JSON, nullable=True) # array of photo URLs
    times_rented = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", backref="items")
