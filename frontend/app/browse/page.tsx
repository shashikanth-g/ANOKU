"use client";

import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ItemGrid } from "@/components/items/ItemGrid";
import { useSearchStore } from "@/store/searchStore";
import { useState } from "react";

export default function BrowsePage() {
  const { query } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = ["Women", "Men", "Kids", "Bags", "Dresses", "Accessories"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Explore Collection</h1>
            
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-[var(--color-primary)] text-white' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-[var(--color-border)]'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-[var(--color-border)]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <ItemGrid category={selectedCategory} searchQuery={query} />
          </div>
        </main>
      </div>
      
      <Navigation />
    </div>
  );
}
