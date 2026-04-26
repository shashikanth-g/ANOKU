"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingBag, ArrowRight, ChevronRight, Clock, Truck, Sparkles, Waves } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, CheckCircle2, Info } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalRent = items.reduce((sum, item) => sum + (item.totalPrice - item.deliveryCharge), 0);
  const totalLogistics = items.reduce((sum, item) => sum + item.deliveryCharge, 0);
  const grandTotal = totalRent + totalLogistics;

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
            owner_id: item.ownerId, // Using the correct owner from the cart item
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + (item.durationHours * 3600000)).toISOString().split('T')[0],
            duration_hours: item.durationHours,
            total_price: Math.round(item.totalPrice),
            delivery_type: item.deliveryType || "standard",
            status: "confirmed",
            delivery_address: "Address on file", // Placeholder
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
            {items.map((item, index) => (
              <Card key={item.cartItemId || `${item.id}-${index}`} className="overflow-hidden border-none shadow-xl glass group">
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
                        <h3 className="font-bold text-base leading-tight mb-1">{item.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3" /> {item.durationHours || 24}h
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${(item.deliveryType || 'standard') === 'premium' ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'text-zinc-500 bg-zinc-100 dark:bg-white/5'}`}>
                            {(item.deliveryType || 'standard') === 'premium' ? <Sparkles className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                            {(item.deliveryType || 'standard').toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-sm">₹{(item.totalPrice || item.price).toLocaleString()}</p>
                         <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Total</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-medium">
                         <span>Rent: ₹{(item.totalPrice || item.price) - (item.deliveryCharge || 0)}</span>
                         <span>Logistics: {(item.deliveryCharge || 0) > 0 ? `₹${item.deliveryCharge}` : 'Free'}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[var(--color-error)] opacity-50 hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-12 p-8 rounded-3xl bg-[var(--color-card)] shadow-2xl border border-[var(--color-border)] relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6">Price Summary</h3>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-[var(--color-text-primary)]">₹{totalRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Logistics & Delivery</span>
                  <span className="font-medium text-[var(--color-success)]">{totalLogistics > 0 ? `₹${totalLogistics.toLocaleString()}` : 'Free'}</span>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="font-bold text-lg">Grand Total</span>
                  <span className="font-bold text-2xl text-[var(--color-primary)]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs text-[var(--color-text-secondary)] mb-6 bg-black/5 dark:bg-white/5 p-4 rounded-xl flex gap-3">
                <Info className="w-4 h-4 flex-shrink-0 text-[var(--color-primary)]" />
                <p className="leading-relaxed">
                  Your premium logistics includes professional wash, insurance coverage during transit, and safe packaging.
                </p>
              </div>
              
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
