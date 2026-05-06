"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { Star, Shield, Info, Calendar as CalendarIcon, Loader2, Package, CheckCircle, Share2, ShoppingCart, Crosshair, Sparkles, Waves, ShieldCheck, Truck } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("4"); // changed to string for better input handling
  const [durationType, setDurationType] = useState<"hours" | "days">("hours");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const durationNum = Number(duration) || 0;
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (params.id) {
      fetchApi(`/items/${params.id}`)
        .then(data => setItem(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  useEffect(() => {
    if (item) {
      const photos = (item.photos && item.photos.length > 0 && item.photos[0]) 
        ? item.photos 
        : ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80"];
      setGalleryImages(photos);
    }
  }, [item]);

  const handleImageError = (idx: number) => {
    const newImages = [...galleryImages];
    newImages[idx] = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80";
    setGalleryImages(newImages);
  };

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");

  useEffect(() => {
    if (user) {
      setRenterName(user.name || "");
      setRenterPhone(user.phone || "");
      setDeliveryAddress(user.address || "");
    }
  }, [user]);

  const totalPrice = item ? Math.round((item.daily_price / 24) * durationNum) : 0;

  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCartStore();
  const [cartMessage, setCartMessage] = useState("");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          url: window.location.href
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCartMessage("Link copied to clipboard!");
      setTimeout(() => setCartMessage(""), 2000);
    }
  };

  const handleAddToCart = () => {
    const finalDuration = durationNum || 24;
    const logisticsCharge = deliveryType === "premium" ? 249 : 0;
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.daily_price,
      image: galleryImages[0],
      deliveryType: deliveryType,
      deliveryCharge: logisticsCharge,
      durationHours: finalDuration,
      totalPrice: totalPrice + logisticsCharge,
      ownerId: item.owner_id
    });
    setCartMessage("Added to cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleBookNow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!deliveryAddress) {
      alert("Please provide a delivery address");
      return;
    }
    
    if (!duration || durationNum <= 0) {
      alert("Please enter a valid duration");
      return;
    }
    
    setBookingLoading(true);
    try {
      await fetchApi("/bookings/", {
        method: "POST",
        body: JSON.stringify({
          item_id: item.id,
          renter_id: user.id,
          owner_id: item.owner_id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 3600000 * durationNum).toISOString().split('T')[0],
          duration_hours: durationNum,
          total_price: totalPrice + (deliveryType === "premium" ? 249 : 0),
          status: "confirmed",
          delivery_address: deliveryAddress,
          renter_name: renterName,
          renter_phone: renterPhone,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          delivery_type: deliveryType,
          pickup_time: pickupTime || null,
          delivery_time: deliveryTime || null
        }),
      });
      setShowSuccess(true);
    } catch (err: any) {
      alert(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)]">
        <p className="text-xl font-bold text-[var(--color-text-secondary)]">Item not found</p>
        <Button href="/" variant="outline" className="mt-4">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-900">
              <Image 
                src={galleryImages[activeImage]} 
                alt={item.name}
                fill
                className="object-cover"
                priority
                onError={() => handleImageError(activeImage)}
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-[var(--color-primary)] scale-105' : 'border-transparent opacity-60'}`}
                  >
                    <Image src={img} alt={`${item.name} ${idx}`} fill className="object-cover" onError={() => handleImageError(idx)} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Booking */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">{item.category}</p>
                  <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full bg-white dark:bg-zinc-800 shadow-sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 shadow-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                    <span className="font-bold text-sm">{item.rating || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1"><Info className="w-4 h-4" /> Size: {item.size}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Condition: Excellent</span>
              </div>
            </div>

            <Card className="p-6 border-[var(--color-primary)]/10 bg-[var(--color-card)]/40 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Rental Price</p>
                    <p className="text-3xl font-bold">
                      ₹{durationType === "hours" ? Math.round(item.daily_price / 24) : item.daily_price} 
                      <span className="text-sm font-normal text-[var(--color-text-secondary)]">
                        {durationType === "hours" ? "/ hour" : "/ day"}
                      </span>
                    </p>
                  </div>
                </div>
              
                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)]">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] mb-1.5 ml-1">
                      Rental Duration (Hours)
                    </p>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1"
                        placeholder="e.g. 4"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 px-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">
                      Choose Logistics Plan
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Standard Card */}
                      <button 
                        onClick={() => setDeliveryType("standard")}
                        className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${deliveryType === "standard" ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <Truck className="w-5 h-5 text-zinc-500" />
                          </div>
                          {deliveryType === "standard" && <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />}
                        </div>
                        <p className="font-bold text-sm mb-1">Standard</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight mb-2">
                          Pickup & Safe Delivery only. No cleaning.
                        </p>
                        <p className="mt-auto font-bold text-sm text-[var(--color-primary)]">Free</p>
                      </button>

                      {/* Premium Card */}
                      <button 
                        onClick={() => setDeliveryType("premium")}
                        className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${deliveryType === "premium" ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'}`}
                      >
                        <div className="absolute top-0 right-0 p-1.5 bg-[var(--color-accent)] text-white">
                          <Sparkles className="w-3 h-3" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-lg bg-[var(--color-accent)]/10">
                            <Waves className="w-5 h-5 text-[var(--color-accent)]" />
                          </div>
                          {deliveryType === "premium" && <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />}
                        </div>
                        <p className="font-bold text-sm mb-1">Premium Logistics</p>
                        <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight mb-2">
                          Includes Professional Wash, Laundry, & Premium Packing.
                        </p>
                        <p className="mt-auto font-bold text-sm text-[var(--color-accent)]">₹249 <span className="text-[8px] font-normal text-zinc-400">/ order</span></p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] mb-1.5 ml-1">
                        Pickup Time
                      </p>
                      <input 
                        type="datetime-local"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] mb-1.5 ml-1">
                        Expected Delivery Time
                      </p>
                      <input 
                        type="datetime-local"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[var(--color-border)] bg-white dark:bg-zinc-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                   <div className="flex justify-between items-center">
                     <div className="space-y-0.5">
                       <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Total Rental Amount</p>
                       {deliveryType === "premium" && (
                         <p className="text-[9px] text-[var(--color-accent)] font-bold">Includes Premium Logistics (₹249)</p>
                       )}
                     </div>
                     <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1 font-bold text-2xl text-[var(--color-primary)]">
                         <span>₹{totalPrice + (deliveryType === "premium" ? 249 : 0)}</span>
                       </div>
                       <p className="text-[9px] text-[var(--color-text-secondary)] italic">₹{totalPrice} rent + {deliveryType === "premium" ? "₹249 logistics" : "Free delivery"}</p>
                     </div>
                   </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">Delivery Address</label>
                    <textarea 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter full address for pickup/delivery"
                      className="w-full h-20 rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] resize-none"
                    />
                    {(latitude && longitude) && (
                      <div className="flex gap-2 mt-2">
                        <input readOnly value={latitude} placeholder="Latitude" className="w-1/2 text-xs bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-secondary)] focus:outline-none" />
                        <input readOnly value={longitude} placeholder="Longitude" className="w-1/2 text-xs bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-secondary)] focus:outline-none" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) return;
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setLatitude(pos.coords.latitude.toFixed(6));
                            setLongitude(pos.coords.longitude.toFixed(6));
                          },
                          () => {
                            setCartMessage("Location permission denied");
                            setTimeout(() => setCartMessage(""), 2000);
                          }
                        );
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline mt-2"
                    >
                      <Crosshair className="w-3.5 h-3.5" /> Use Current Location
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">Recipient Name</label>
                      <input 
                        type="text"
                        value={renterName}
                        onChange={(e) => setRenterName(e.target.value)}
                        placeholder="Name"
                        className="w-full h-10 rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">Phone</label>
                      <input 
                        type="text"
                        value={renterPhone}
                        onChange={(e) => setRenterPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full h-10 rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                </div>
              </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button 
                    onClick={handleAddToCart} 
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl text-lg font-bold border-2 border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/5"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    onClick={handleBookNow} 
                    className="flex-[2] h-14 rounded-2xl text-lg shadow-xl shadow-[var(--color-primary)]/20"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Book Now"}
                  </Button>
                </div>
                
                {cartMessage && (
                  <p className="text-sm font-bold text-[var(--color-success)] text-center mt-3 animate-in fade-in slide-in-from-bottom-2">
                    {cartMessage}
                  </p>
                )}
              
              <p className="text-[10px] text-center text-[var(--color-text-secondary)] mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Secure checkout for premium fashion
              </p>
            </Card>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">About the Item</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-6 border-t border-[var(--color-border)]">
              <h3 className="font-bold text-lg mb-4">Ownership</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-200">
                  <div className="flex items-center justify-center h-full w-full text-lg font-bold text-zinc-500">O</div>
                </div>
                <div>
                  <p className="font-bold">Verified Owner</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                     <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]" /> 5.0</span>
                     <span>•</span>
                     <span>Trusted Partner</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--color-border)]">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                ANOKU Trust & Safety
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--color-success)]/5 border border-[var(--color-success)]/10 text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Secure Handling</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Expertly handled and packaged with care</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Quality Checked</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Inspected for authenticity and condition</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">No Damage Protection</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">No Damage? No Charges. Your peace of mind is ours.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Navigation />

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[var(--color-card)] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[var(--color-primary)]/20 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
                <p className="text-[var(--color-text-secondary)]">Your premium fashion piece is reserved.</p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Item</span>
                  <span className="font-bold">{item.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Duration</span>
                  <span className="font-bold">{durationNum >= 24 ? `${Math.round(durationNum/24)} Days` : `${durationNum} Hours`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Total Paid</span>
                  <span className="font-bold text-[var(--color-primary)]">₹{totalPrice}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 space-y-2">
                <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">Next Steps</p>
                <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                   Our team will contact you within <span className="font-bold text-[var(--color-text-primary)]">1–2 hours</span> to coordinate delivery.
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)] italic">
                  *Delivery & pickup handled manually by Anoku Logistics.
                </p>
              </div>

              <div className="w-full flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl h-12"
                  onClick={() => setShowSuccess(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 rounded-xl h-12"
                  onClick={() => router.push("/bookings")}
                >
                  My Bookings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
