"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleBookAll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsBooking(true);
    try {
      // Loop through and create bookings for each item
      for (const item of items) {
        await fetchApi("/bookings/", {
          method: "POST",
          body: JSON.stringify({
            item_id: item.id,
            renter_id: user.id,
            owner_id: "0f73f16f-bd41-4c0d-830d-d3196f69532e", // Fallback owner ID for MVP
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 1 day default
            duration_hours: 24,
            total_price: item.price,
            deposit: 500,
            status: "confirmed",
            delivery_address: "Address on file", // Placeholder for MVP
            renter_name: user.name || "Customer",
            renter_phone: "0000000000"
          }),
        });
      }
      setShowSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push("/bookings");
      }, 3000);
    } catch (err: any) {
      alert("Booking failed for some items: " + err.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {items.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-sm text-[var(--color-error)] font-medium hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)]">
             <ShoppingBag className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-20" />
             <p className="text-lg font-medium text-[var(--color-text-secondary)]">Your cart is empty</p>
             <p className="text-sm text-[var(--color-text-secondary)] mt-1">Discover premium pieces to add to your collection.</p>
             <Button href="/" className="mt-8 rounded-xl px-8 h-12 shadow-lg">Start Browsing</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-xl glass group">
                <CardContent className="p-0 flex h-28">
                  <div className="relative w-28 h-full bg-black/5">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                        <p className="text-xs text-[var(--color-primary)] font-bold">₹{item.price} <span className="text-[var(--color-text-secondary)] font-normal">/ day</span></p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-full hover:bg-[var(--color-error)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => router.push(`/items/${item.id}`)}
                        className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Book Now <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-12 p-8 rounded-3xl bg-[var(--color-card)] shadow-2xl border border-[var(--color-border)] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium">Cart Total ({items.length} items)</p>
                  <p className="text-3xl font-bold">₹{totalPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-secondary)] italic">Delivery handled separately</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-6 bg-black/5 dark:bg-white/5 p-4 rounded-xl leading-relaxed">
                Clicking "Book All" will create separate bookings for each item. Our team will coordinate delivery for all pieces together.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleBookAll}
                  disabled={isBooking}
                  className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-[var(--color-primary)]/20"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Booking Items...
                    </>
                  ) : (
                    <>
                      Book All Items <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
                <Button href="/" variant="outline" className="w-full h-14 rounded-2xl text-lg">
                  Continue Shopping
                </Button>
              </div>

              {showSuccess && (
                <div className="absolute inset-0 bg-[var(--color-card)]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                  <CheckCircle2 className="w-16 h-16 text-[var(--color-success)] mb-4 animate-in zoom-in" />
                  <h3 className="text-2xl font-bold mb-2">Success!</h3>
                  <p className="text-[var(--color-text-secondary)]">All items have been booked successfully. Redirecting to your bookings...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
