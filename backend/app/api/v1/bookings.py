from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.db.database import get_db
from app.schemas.booking import Booking, BookingCreate, BookingUpdate
from app.crud import booking as crud_booking

router = APIRouter()

@router.post("/", response_model=Booking)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    return crud_booking.create_booking(db=db, booking=booking)

@router.get("/{booking_id}", response_model=Booking)
def read_booking(booking_id: UUID, db: Session = Depends(get_db)):
    db_booking = crud_booking.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

@router.get("/renter/{renter_id}", response_model=List[Booking])
def read_bookings_by_renter(renter_id: UUID, db: Session = Depends(get_db)):
    return crud_booking.get_bookings_by_renter(db, renter_id=renter_id)

@router.get("/owner/{owner_id}", response_model=List[Booking])
def read_bookings_by_owner(owner_id: UUID, db: Session = Depends(get_db)):
    return crud_booking.get_bookings_by_owner(db, owner_id=owner_id)

@router.put("/{booking_id}/status", response_model=Booking)
def update_booking_status(booking_id: UUID, booking_update: BookingUpdate, db: Session = Depends(get_db)):
    db_booking = crud_booking.update_booking(db, booking_id=booking_id, booking_update=booking_update)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking
