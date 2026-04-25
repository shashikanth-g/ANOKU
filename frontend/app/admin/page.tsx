"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Skeleton } from "@/components/common/Skeleton";
import {
  Search,
  Filter,
  Calendar,
  Package,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  MoreVertical,
  XCircle,
  Box,
  Crosshair
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Admin Email for access control
const ADMIN_EMAIL = "shashikanth.aeriva@gmail.com";

type BookingStatus = "pending" | "approved" | "picked" | "delivered" | "completed" | "cancelled";
type PaymentStatus = "paid" | "pending" | "cash_on_delivery";

interface Booking {
  id: string;
  item: {
    name: string;
    photos: string[];
    category: string;
    owner?: {
      name: string;
    };
  };
  renter_name: string;
  renter_phone: string;
  delivery_address: string;
  start_date: string;
  end_date: string;
  duration_hours: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  delivery_type: "standard" | "premium";
  pickup_required: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const userEmail = user?.email || (user as any)?.user?.email;

  useEffect(() => {
    console.log("ADMIN USER:", user);
    if (userEmail === "offical.shashikanth@gmail.com") {
      loadBookings();
    }
  }, [user, userEmail]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/bookings/");
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const updated = await fetchApi(`/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const isNew = (dateStr: string) => {
    const created = new Date(dateStr);
    const now = new Date();
    return (now.getTime() - created.getTime()) < (60 * 60 * 1000); // 1 hour
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.renter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.renter_phone.includes(searchQuery) ||
      b.item.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || b.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="p-6 text-zinc-500 font-medium">Loading session...</p>
      </div>
    );
  }

  if (userEmail !== "offical.shashikanth@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-zinc-500">Your email ({userEmail || "unknown"}) does not have admin privileges.</p>
          <Button href="/" variant="outline">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <Header />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-500">Manage all ANOKU bookings and logistics.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={loadBookings} variant="outline" size="sm" className="h-10">
              Refresh Data
            </Button>
          </div>
        </header>

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search by name, phone, or item..."
                className="pl-9 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                className="h-11 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="picked">Picked</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="h-11 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] w-full"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cash_on_delivery">COD</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold">Failed to load bookings</h3>
            <p className="text-zinc-500">{error}</p>
            <Button onClick={loadBookings}>Try Again</Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Box className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-xl font-bold">No bookings found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <BookingCard
                    booking={booking}
                    onStatusUpdate={updateStatus}
                    isNew={isNew(booking.created_at)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}

function BookingCard({
  booking,
  onStatusUpdate,
  isNew
}: {
  booking: Booking,
  onStatusUpdate: (id: string, s: BookingStatus) => void,
  isNew: boolean
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
    approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
    picked: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500",
    delivered: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-500",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500",
  };

  const steps = ["pending", "approved", "picked", "delivered", "completed"];
  const currentStepIndex = steps.indexOf(booking.status);

  return (
    <Card className={cn(
      "overflow-hidden border-transparent shadow-md hover:shadow-xl transition-all relative",
      isNew && "ring-2 ring-[var(--color-primary)] ring-offset-2"
    )}>
      {isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
          </span>
        </div>
      )}

      <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
              <img src={booking.item.photos?.[0] || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80"} className="w-full h-full object-cover" alt={booking.item.name} />
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1">{booking.item.name}</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wider font-bold text-[var(--color-primary)]">
                {booking.item.category} • {booking.item.owner?.name || "Premium Owner"}
              </CardDescription>
            </div>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter", statusColors[booking.status])}>
            {booking.status}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> User Info
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{booking.renter_name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Phone className="w-3 h-3" /> {booking.renter_phone}
              </div>
              <div className="flex items-start gap-2 text-xs text-zinc-500">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{booking.delivery_address}</span>
              </div>
              {booking.latitude && booking.longitude && (
                <div className="pt-1">
                  <a 
                    href={`https://www.google.com/maps?q=${booking.latitude},${booking.longitude}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-primary)] hover:underline"
                  >
                    <Crosshair className="w-3 h-3" />
                    {booking.latitude.toFixed(4)}, {booking.longitude.toFixed(4)} • Open Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Booking
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Dates</span>
                <span className="font-semibold">{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Duration</span>
                <span className="font-semibold">{booking.duration_hours} Hours</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Booked On</span>
                <span className="font-semibold">{new Date(booking.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Payment
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Total Price</span>
                <span className="font-bold text-[var(--color-primary)] text-sm">₹{booking.total_price}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Status</span>
                <span className={cn(
                  "font-bold uppercase text-[10px]",
                  booking.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
                )}>{booking.payment_status}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 italic">
                <span>Method: {booking.payment_method || "Online"}</span>
              </div>
            </div>
          </div>

          {/* Logistics Info */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Truck className="w-3 h-3" /> Logistics
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Type</span>
                <span className="font-semibold capitalize">{booking.delivery_type}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Pickup Required</span>
                <span className="font-semibold">{booking.pickup_required ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Stepper */}
        {booking.status !== "cancelled" && (
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, idx) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1",
                    idx <= currentStepIndex ? "bg-[var(--color-primary)] text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                  )}>
                    {idx < currentStepIndex ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span className={cn(
                    "text-[8px] uppercase font-bold tracking-tighter",
                    idx <= currentStepIndex ? "text-[var(--color-primary)]" : "text-zinc-400"
                  )}>{s}</span>
                </div>
              ))}
            </div>
            <div className="relative h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-[var(--color-primary)] transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
          {booking.status === "pending" && (
            <Button size="sm" className="h-10 px-4 bg-green-600 hover:bg-green-700" onClick={() => onStatusUpdate(booking.id, "approved")}>
              Approve
            </Button>
          )}
          {booking.status === "approved" && (
            <Button size="sm" className="h-10 px-4 bg-blue-600 hover:bg-blue-700" onClick={() => onStatusUpdate(booking.id, "picked")}>
              Mark Picked
            </Button>
          )}
          {booking.status === "picked" && (
            <Button size="sm" className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700" onClick={() => onStatusUpdate(booking.id, "delivered")}>
              Mark Delivered
            </Button>
          )}
          {booking.status === "delivered" && (
            <Button size="sm" className="h-10 px-4 bg-[var(--color-primary)]" onClick={() => onStatusUpdate(booking.id, "completed")}>
              Complete
            </Button>
          )}

          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <Button size="sm" variant="ghost" className="h-10 px-4 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onStatusUpdate(booking.id, "cancelled")}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
