import razorpay
from app.core.config import settings

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID or "your_key_id", settings.RAZORPAY_SECRET or "your_secret"))

def create_order(amount: int, currency: str = "INR"):
    # Amount is in paise (100 paise = 1 INR)
    data = {
        "amount": amount * 100,
        "currency": currency,
        "payment_capture": 1 # Auto-capture payment
    }
    return client.order.create(data=data)

def verify_payment(order_id: str, payment_id: str, signature: str):
    params_dict = {
        'razorpay_order_id': order_id,
        'razorpay_payment_id': payment_id,
        'razorpay_signature': signature
    }
    try:
        client.utility.verify_payment_signature(params_dict)
        return True
    except Exception:
        return False
