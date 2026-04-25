"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { useAuthStore } from "@/store/authStore";
import { fetchApi } from "@/lib/api";
import { Shirt, Plus, Loader2, Star, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyItemsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchApi(`/items/owner/${user.id}`)
      .then(data => setItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, router]);

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
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold">My Items</h1>
           <Button href="/owner/upload" className="rounded-full gap-2">
              <Plus className="w-4 h-4" /> List New
           </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)]">
             <Shirt className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-20" />
             <p className="text-lg font-medium text-[var(--color-text-secondary)]">No items listed yet</p>
             <p className="text-sm text-[var(--color-text-secondary)] mt-1">Start earning by listing your premium fashion pieces.</p>
             <Button href="/owner/upload" className="mt-6">List Your First Item</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-xl glass">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-auto">
                    <img 
                      src={item.photos?.[0] || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 shadow-sm px-2 py-1 rounded-lg">
                           <Star className="w-3.5 h-3.5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                           <span className="font-bold text-xs">{item.rating || 0}</span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[var(--color-primary)]">₹{item.daily_price} <span className="text-xs font-normal text-[var(--color-text-secondary)]">/ day</span></p>
                    </div>

                    <div className="flex gap-3 mt-6">
                       <Button 
                         variant="outline" 
                         className="flex-1 rounded-xl h-10 text-xs gap-2"
                         onClick={() => router.push(`/owner/edit/${item.id}`)}
                       >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                       </Button>
                       <Button 
                         variant="ghost" 
                         className="rounded-xl h-10 text-xs gap-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                         onClick={async () => {
                           if (confirm("Are you sure you want to delete this item?")) {
                             try {
                               await fetchApi(`/items/${item.id}`, { method: "DELETE" });
                               setItems(items.filter(i => i.id !== item.id));
                             } catch (err) {
                               alert("Failed to delete item");
                             }
                           }
                         }}
                       >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                       </Button>
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
