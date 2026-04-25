"use client";

import * as React from "react";
import { Button } from "@/components/common/Button";
import { ShieldCheck, Loader2 } from "lucide-react";

interface RazorpayCheckoutProps {
  amount: number;
  bookingId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({ amount, bookingId, onSuccess, onError }: RazorpayCheckoutProps) {
  const [loading, setLoading] = React.useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // In real app, call backend to create order
    // const orderData = await fetch('/api/v1/payments/create-order', { ... });
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_id",
      amount: amount * 100,
      currency: "INR",
      name: "ANOKU",
      description: "Rental Payment & Deposit",
      image: "/logo.png",
      order_id: "", // Generate this from backend
      handler: function (response: any) {
        onSuccess(response);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0B6E6E",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <Button 
      onClick={handlePayment} 
      className="w-full h-14 rounded-2xl text-lg shadow-xl"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <ShieldCheck className="w-5 h-5 mr-2" />
      )}
      Pay ₹{amount} Securely
    </Button>
  );
}
