from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import payment_service
from pydantic import BaseModel

router = APIRouter()

class OrderCreate(BaseModel):
    amount: int
    booking_id: str

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_payment_order(order: OrderCreate):
    try:
        razorpay_order = payment_service.create_order(order.amount)
        return razorpay_order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify")
def verify_payment(payment: PaymentVerify):
    is_valid = payment_service.verify_payment(
        payment.razorpay_order_id,
        payment.razorpay_payment_id,
        payment.razorpay_signature
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    return {"status": "success", "message": "Payment verified"}
