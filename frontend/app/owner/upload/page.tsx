"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Camera, Upload, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function ItemUploadPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    category: "Women",
    size: "M",
    daily_price: "",
    description: "",
    imageUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => setStep(step + 1);

  const handleSubmit = async () => {
    if (!user) {
      setError("Please login to list items");
      return;
    }

    if (!formData.name || !formData.daily_price || !formData.category) {
      setError("Please fill in all required fields (Name, Price, Category)");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await fetchApi("/items/", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          size: formData.size,
          description: formData.description,
          daily_price: parseInt(formData.daily_price),
          owner_id: user.id,
          photos: [formData.imageUrl || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"]
        }),
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to list item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32 max-w-2xl">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-[var(--color-primary)]' : 'w-4 bg-gray-200 dark:bg-gray-800'}`} 
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold">List your item</h1>
          <p className="text-[var(--color-text-secondary)]">Complete these steps to reach thousands of renters</p>
        </div>

        {error && (
          <p className="mb-6 p-4 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-2xl text-sm font-medium border border-[var(--color-error)]/20 animate-in fade-in slide-in-from-top-2">
            {error}
          </p>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Camera className="w-5 h-5 text-[var(--color-primary)]" />
                Add Photos
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-xs font-bold ml-1 text-[var(--color-text-secondary)] uppercase">Upload from device</label>
                  <div className="relative mt-1">
                    <div className="flex h-14 w-full rounded-2xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 px-4 py-3 text-sm transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer relative overflow-hidden group">
                      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <Upload className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors" />
                        <span className="font-medium">Choose a photo</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-bold ml-1 text-[var(--color-text-secondary)] uppercase">OR Paste Image URL</label>
                  <div className="relative mt-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                    <Input 
                      name="imageUrl"
                      placeholder="https://images.unsplash.com/photo..." 
                      className="pl-12 h-14 rounded-2xl"
                      value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/5] rounded-3xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 transition-colors overflow-hidden">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                        <p className="text-xs font-bold text-[var(--color-text-secondary)]">Preview</p>
                      </>
                    )}
                  </div>
                  <Card className="p-6 flex flex-col justify-center">
                    <h4 className="font-bold mb-2 text-sm">Pro Tip</h4>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      High-quality photos in natural light increase booking rates by up to 2.5x.
                    </p>
                  </Card>
                </div>
              </div>
            </div>

            <Button onClick={handleNext} className="w-full h-14 rounded-2xl text-lg mt-8">
              Continue to Details <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Item Title</label>
                  <Input 
                    name="name"
                    placeholder="e.g. Floral Summer Midi Dress" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option>Women</option>
                      <option>Men</option>
                      <option>Kids</option>
                      <option>Bags</option>
                      <option>Dresses</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Size</label>
                    <select 
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Price Per Day (₹)</label>
                  <Input 
                    name="daily_price"
                    type="number" 
                    placeholder="499" 
                    value={formData.daily_price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Description</label>
                  <textarea 
                    name="description"
                    className="w-full min-h-[120px] rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Tell us about the fabric, fit, and condition..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
             </div>

             <div className="flex gap-4 mt-8">
               <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl" disabled={loading}>
                 Back
               </Button>
               <Button onClick={handleSubmit} className="flex-[2] h-14 rounded-2xl" disabled={loading}>
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish Listing"}
               </Button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10 animate-in zoom-in duration-700">
            <div className="w-24 h-24 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Item Listed!</h2>
            <p className="text-[var(--color-text-secondary)] mb-10 max-w-sm mx-auto">
              Your "{formData.name}" is now live. We'll notify you when someone wants to rent it.
            </p>
            <div className="space-y-4">
              <Button href="/" className="w-full h-14 rounded-2xl">
                Go to Homepage
              </Button>
              <Button variant="ghost" onClick={() => {setStep(1); setFormData({ name: "", category: "Dresses", size: "M", daily_price: "", description: "", imageUrl: "" });}} className="w-full h-14 rounded-2xl">
                List another item
              </Button>
            </div>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
