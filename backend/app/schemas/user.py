from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    phone: str
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: str = "renter"
    bio: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    profile_photo_url: Optional[str] = None

class User(UserBase):
    id: UUID
    profile_photo_url: Optional[str] = None
    rating: float
    total_reviews: int
    kyc_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
