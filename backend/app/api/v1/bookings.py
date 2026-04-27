from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.db.database import get_db
from app.schemas.booking import Booking as BookingSchema, BookingCreate, BookingUpdate
from app.models.booking import Booking
from app.crud import booking as crud_booking
from app.crud.notification import create_notification

router = APIRouter()

@router.post("/", response_model=BookingSchema)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    new_booking = crud_booking.create_booking(db=db, booking=booking)
    create_notification(db, new_booking.renter_id, "Your booking has been placed successfully")
    create_notification(db, new_booking.owner_id, "You have a new booking request")
    return new_booking

@router.get("/", response_model=List[BookingSchema])
def get_all_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingSchema)
def read_booking(booking_id: UUID, db: Session = Depends(get_db)):
    db_booking = crud_booking.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

@router.get("/renter/{renter_id}", response_model=List[BookingSchema])
def read_bookings_by_renter(renter_id: UUID, db: Session = Depends(get_db)):
    return crud_booking.get_bookings_by_renter(db, renter_id=renter_id)

@router.get("/owner/{owner_id}", response_model=List[BookingSchema])
def read_bookings_by_owner(owner_id: UUID, db: Session = Depends(get_db)):
    return crud_booking.get_bookings_by_owner(db, owner_id=owner_id)

@router.patch("/{booking_id}")
def update_booking_status(
    booking_id: UUID,
    data: dict,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if "status" in data:
        booking.status = data["status"]
        create_notification(db, booking.renter_id, f"Booking status updated to {booking.status}")
        create_notification(db, booking.owner_id, f"Booking status updated to {booking.status}")
    
    if "payment_status" in data:
        booking.payment_status = data["payment_status"]

    db.commit()
    db.refresh(booking)

    return booking
