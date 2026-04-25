"use client";


import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/common/Button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ItemGrid } from "@/components/items/ItemGrid";
import { useSearchStore } from "@/store/searchStore";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { query } = useSearchStore();

  const categories = ["Women", "Men", "Kids", "Bags", "Dresses", "Accessories"];

  const scrollToItems = () => {
    document.getElementById("trending-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-primary)] text-white p-6 sm:p-10 lg:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                <div className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-white/5 rounded-full blur-[60px] sm:blur-[80px]"></div>
              </div>
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                <div className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-[var(--color-accent)]/20 rounded-full blur-[40px] sm:blur-[60px]"></div>
              </div>
              
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span>Premium Fashion Rental</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 sm:mb-6 leading-[1.1]">
                  Rent high-end fashion at <span className="text-[var(--color-accent)] italic font-serif tracking-normal">70% off</span> retail.
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 max-w-xl font-medium leading-relaxed">
                  Peer-to-peer fashion & accessories rental. We handle pickup, cleaning, and delivery. You just wear it.
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-[var(--color-primary)] hover:bg-white/90 min-h-[48px] h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-2xl shadow-xl shadow-white/10 w-full sm:w-auto"
                    onClick={scrollToItems}
                  >
                    Explore Collection
                  </Button>
                  <Button 
                    size="lg" 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 min-h-[48px] h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-2xl w-full sm:w-auto"
                    href="/owner/upload"
                  >
                    List an Item <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`min-h-[48px] px-5 sm:px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-white dark:bg-zinc-800 text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[48px] px-5 sm:px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-white dark:bg-zinc-800 text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Trending Items Grid */}
            <div id="trending-section">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {selectedCategory ? `${selectedCategory} Collection` : "Trending Near You"}
                </h2>
                <Button variant="ghost" className="text-[var(--color-primary)] min-h-[48px] px-4">View All</Button>
              </div>
              <ItemGrid category={selectedCategory} searchQuery={query} />
            </div>
            
          </div>
        </main>
      </div>
      
      <Navigation />
    </div>
  );
}
