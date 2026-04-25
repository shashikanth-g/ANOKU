"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Camera, Upload, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon, Save } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";

export default function ItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (params.id) {
      fetchApi(`/items/${params.id}`)
        .then(data => {
          setFormData({
            name: data.name,
            category: data.category,
            size: data.size,
            daily_price: data.daily_price.toString(),
            description: data.description || "",
            imageUrl: data.photos?.[0] || ""
          });
        })
        .catch(err => setError("Failed to load item details"))
        .finally(() => setLoading(false));
    }
  }, [params.id, user, router]);

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.daily_price || !formData.category) {
      setError("Please fill in all required fields (Name, Price, Category)");
      return;
    }
    
    setSaving(true);
    setError("");
    
    try {
      await fetchApi(`/items/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          size: formData.size,
          description: formData.description,
          daily_price: parseInt(formData.daily_price),
          photos: [formData.imageUrl]
        }),
      });
      router.push("/owner/items");
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32 max-w-2xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Edit Item</h1>
          <p className="text-[var(--color-text-secondary)]">Update your item details</p>
        </div>

        {error && (
          <p className="mb-6 p-4 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-2xl text-sm font-medium border border-[var(--color-error)]/20">
            {error}
          </p>
        )}

        <div className="space-y-8">
            {/* Photos Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Camera className="w-5 h-5 text-[var(--color-primary)]" />
                Photos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-[4/5] rounded-3xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 overflow-hidden">
                    {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />}
                </div>
                <div className="space-y-4">
                    <div className="relative">
                      <label className="text-xs font-bold ml-1 text-[var(--color-text-secondary)] uppercase">Update photo</label>
                      <div className="relative mt-1">
                        <div className="flex h-12 w-full rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 px-4 py-3 text-sm transition-all cursor-pointer relative overflow-hidden group">
                          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <Upload className="w-4 h-4" />
                            <span className="font-medium text-xs">Choose new file</span>
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
                      <label className="text-xs font-bold ml-1 text-[var(--color-text-secondary)] uppercase">OR Image URL</label>
                      <Input 
                        name="imageUrl"
                        placeholder="https://..." 
                        className="mt-1 h-12 rounded-xl"
                        value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                        onChange={handleChange}
                      />
                    </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
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
              <Button variant="outline" onClick={() => router.back()} className="flex-1 h-14 rounded-2xl" disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-[2] h-14 rounded-2xl gap-2" disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
              </Button>
            </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
