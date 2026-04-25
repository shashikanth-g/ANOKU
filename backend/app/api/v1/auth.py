from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.database import get_db
from app.core import security
from app.core.config import settings
from app.crud import user as crud_user
from app.schemas.user import User, UserCreate

router = APIRouter()

from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    username: str # email or phone
    password: str

@router.post("/signup", response_model=User)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_phone(db, phone=user.phone)
    if db_user:
        raise HTTPException(status_code=400, detail="Phone already registered")
    if user.email:
        db_user = crud_user.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create_user(db=db, user=user)

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # Try finding by email first, then phone
    db_user = crud_user.get_user_by_email(db, email=login_data.username)
    if not db_user:
        db_user = crud_user.get_user_by_phone(db, phone=login_data.username)
    
    if not db_user or not security.verify_password(login_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email/phone or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        db_user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "phone": db_user.phone,
            "role": db_user.role,
            "address": db_user.address
        }
    }
