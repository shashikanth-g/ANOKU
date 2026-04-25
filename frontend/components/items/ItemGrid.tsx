"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { SkeletonItemCard } from "../common/Skeleton";

export function ItemGrid({ category, searchQuery }: { category?: string | null, searchQuery?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchApi("/items/");
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = !category || item.category === category;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonItemCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 p-6 bg-[var(--color-error)]/5 rounded-3xl border border-[var(--color-error)]/10">
        <p className="text-[var(--color-error)] font-semibold">Failed to load items</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-bold text-[var(--color-primary)] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-[var(--color-border)] rounded-3xl">
        <p className="text-[var(--color-text-secondary)] font-medium">
          {searchQuery ? "No items found matching your search." : "No items found."}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          {searchQuery ? "Try a different keyword or browse categories." : "Be the first to list a premium piece!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {filteredItems.map((item) => (
        <ItemCard 
          key={item.id} 
          id={item.id}
          name={item.name}
          brand={item.category} // Using category as brand placeholder
          imageUrl={item.photos && item.photos.length > 0 ? item.photos[0] : "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"}
          dailyPrice={item.daily_price}
          rating={item.rating || 0}
          reviewsCount={0}
        />
      ))}
    </div>
  );
}
