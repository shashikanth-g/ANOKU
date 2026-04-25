from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate
from uuid import UUID

def get_booking(db: Session, booking_id: UUID):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def get_bookings_by_renter(db: Session, renter_id: UUID):
    return db.query(Booking).filter(Booking.renter_id == renter_id).all()

def get_bookings_by_owner(db: Session, owner_id: UUID):
    return db.query(Booking).filter(Booking.owner_id == owner_id).all()

def get_all_bookings(db: Session):
    return db.query(Booking).order_by(Booking.created_at.desc()).all()

def create_booking(db: Session, booking: BookingCreate):
    db_booking = Booking(**booking.model_dump())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking(db: Session, booking_id: UUID, booking_update: BookingUpdate):
    db_booking = get_booking(db, booking_id)
    if not db_booking:
        return None
    update_data = booking_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_booking, key, value)
    db.commit()
    db.refresh(db_booking)
    return db_booking
