"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/common/Card";
import Skeleton from "@/components/common/Skeleton";
import { useAuthStore } from "@/store/authStore";
import { fetchApi } from "@/lib/api";
import { Calendar, Package, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchApi(`/bookings/renter/${user.id}`)
      .then(data => setBookings(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-3xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)]">
             <Package className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-20" />
             <p className="text-lg font-medium text-[var(--color-text-secondary)]">No bookings yet</p>
             <p className="text-sm text-[var(--color-text-secondary)] mt-1">Rent your first premium item today!</p>
             <button onClick={() => router.push("/")} className="mt-6 font-bold text-[var(--color-primary)]">Browse Items</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="overflow-hidden border-none shadow-xl glass transition-all hover:scale-[1.01] cursor-pointer"
                onClick={() => router.push(`/items/${booking.item_id}`)}
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
                    <Image 
                      src={booking.item?.photos?.[0] || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"} 
                      alt={booking.item?.name || "Item image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{booking.item?.name}</h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">{booking.item?.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-bold uppercase tracking-wider">
                         <CheckCircle2 className="w-3.5 h-3.5" />
                         {booking.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Rental Period</p>
                          <div className="flex items-center gap-2 text-sm font-medium">
                             <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                             <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Duration</p>
                          <div className="flex items-center gap-2 text-sm font-medium">
                             <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                             <span>{booking.duration_hours >= 24 ? `${Math.floor(booking.duration_hours / 24)} Days` : `${booking.duration_hours} Hours`}</span>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Total Paid</p>
                          <p className="text-lg font-bold text-[var(--color-primary)]">₹{booking.total_price}</p>
                       </div>
                       <div className="space-y-1 col-span-2 sm:col-span-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Status</p>
                          <p className="text-sm font-bold text-[var(--color-success)] uppercase tracking-wider">{booking.status}</p>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Delivery Address</p>
                          <p className="text-xs font-medium leading-relaxed">{booking.delivery_address || "No address provided"}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Recipient</p>
                          <p className="text-xs font-medium">{booking.renter_name || "N/A"} • {booking.renter_phone || "N/A"}</p>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
