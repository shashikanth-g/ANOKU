"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, Phone, MapPin, LogOut, ChevronRight, ShieldCheck, Loader2, Crosshair } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        latitude: "",
        longitude: ""
      });
    }
  }, [user]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const { setAuth } = useAuthStore();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Only send fields the backend UserUpdate schema accepts
      const updatePayload = {
        name: formData.name || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
      };
      const updatedUser = await fetchApi(`/users/me`, {
        method: "PUT",
        body: JSON.stringify(updatePayload)
      });
      setAuth(updatedUser);
      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto">
                 <User className="h-10 w-10 text-[var(--color-primary)]" />
              </div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-[var(--color-text-secondary)]">Please login to view your profile</p>
              <Button href="/login" className="w-full">Login / Sign Up</Button>
           </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
             <div className="relative h-24 w-24 rounded-3xl bg-[var(--color-primary)] flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {formData.name?.[0] || user.phone[0]}
             </div>
             <div>
                <h1 className="text-3xl font-bold">{formData.name || "ANOKU User"}</h1>
                <p className="text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                   <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" /> 
                   Verified Renter • Joined Oct 2024
                </p>
             </div>
          </div>
          <Button 
            variant={isEditing ? "ghost" : "outline"} 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="rounded-xl h-10 px-4"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {saveMessage && (
           <div className={`p-3 mb-6 rounded-xl text-sm font-medium text-center animate-in fade-in slide-in-from-top-2 ${
             saveMessage.type === "success" 
               ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20" 
               : "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20"
           }`}>
             {saveMessage.text}
           </div>
         )}

        <div className="space-y-6">
           <Card className="border-none shadow-xl glass overflow-hidden">
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-bold">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-4 py-2 border-b border-[var(--color-border)]/50">
                    <User className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <div className="flex-1">
                       <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Full Name</p>
                       {isEditing ? (
                         <input 
                           className="w-full bg-transparent border-none focus:outline-none font-medium text-[var(--color-primary)]" 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                       ) : (
                         <p className="font-medium">{formData.name || "Not provided"}</p>
                       )}
                    </div>
                 </div>
                 <div className="flex items-center gap-4 py-2 border-b border-[var(--color-border)]/50">
                    <Mail className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <div className="flex-1">
                       <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Email</p>
                       {isEditing ? (
                         <input 
                           className="w-full bg-transparent border-none focus:outline-none font-medium text-[var(--color-primary)]" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                         />
                       ) : (
                         <p className="font-medium">{formData.email || "Not provided"}</p>
                       )}
                    </div>
                 </div>
                 <div className="flex items-center gap-4 py-2 border-b border-[var(--color-border)]/50">
                    <Phone className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <div className="flex-1">
                       <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Phone</p>
                       {isEditing ? (
                         <input 
                           className="w-full bg-transparent border-none focus:outline-none font-medium text-[var(--color-primary)]" 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         />
                       ) : (
                         <p className="font-medium">+91 {formData.phone}</p>
                       )}
                    </div>
                 </div>
                 <div className="flex items-start gap-4 py-2">
                    <MapPin className="w-5 h-5 text-[var(--color-text-secondary)] mt-1" />
                    <div className="flex-1">
                       <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">Primary Address</p>
                       {isEditing ? (
                          <>
                            <textarea 
                              className="w-full bg-transparent border-none focus:outline-none font-medium text-[var(--color-primary)] resize-none h-20" 
                              value={formData.address}
                              placeholder="Enter your full address"
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                            {(formData.latitude && formData.longitude) && (
                              <div className="flex gap-2 mt-2">
                                <input readOnly value={formData.latitude} placeholder="Latitude" className="w-1/2 text-xs bg-black/5 dark:bg-white/5 rounded p-1 text-[var(--color-text-secondary)]" />
                                <input readOnly value={formData.longitude} placeholder="Longitude" className="w-1/2 text-xs bg-black/5 dark:bg-white/5 rounded p-1 text-[var(--color-text-secondary)]" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (!navigator.geolocation) {
                                  setSaveMessage({ type: "error", text: "Geolocation is not supported by your browser" });
                                  return;
                                }
                                navigator.geolocation.getCurrentPosition(
                                  (pos) => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      latitude: pos.coords.latitude.toFixed(6),
                                      longitude: pos.coords.longitude.toFixed(6)
                                    }));
                                  },
                                  () => {
                                    setSaveMessage({ type: "error", text: "Location permission denied. Please allow access." });
                                    setTimeout(() => setSaveMessage(null), 3000);
                                  }
                                );
                              }}
                              className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] mt-2 hover:underline"
                            >
                              <Crosshair className="w-3.5 h-3.5" /> Use Current Location
                            </button>
                          </>
                        ) : (
                          <p className="font-medium text-sm leading-relaxed">{formData.address || "Add your address for faster delivery"}</p>
                        )}
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-3">
              <Button variant="outline" className="w-full h-14 rounded-2xl justify-start px-6 gap-3">
                 <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                 Trust & Safety
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full h-14 rounded-2xl justify-start px-6 gap-3 text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
              >
                 <LogOut className="w-5 h-5" />
                 Logout
              </Button>
           </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
