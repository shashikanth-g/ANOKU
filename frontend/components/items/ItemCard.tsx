"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  dailyPrice: number;
  rating: number;
  reviewsCount: number;
  className?: string;
}

export function ItemCard({
  id,
  name,
  brand,
  imageUrl,
  dailyPrice,
  rating,
  reviewsCount,
  className,
}: ItemCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Link href={`/items/${id}`} className={cn("block group cursor-pointer", className)}>
      <Card className="overflow-hidden border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
        <div className="relative aspect-[4/5] overflow-hidden bg-black/5 dark:bg-white/5">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/40"
          >
            <Heart
              className={cn("w-5 h-5 transition-colors", isSaved ? "fill-[var(--color-error)] text-[var(--color-error)]" : "text-white")}
            />
          </button>
        </div>
        <CardContent className="p-4 pt-5 space-y-1 relative">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] tracking-wider uppercase">
                  {brand}
                </p>
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[8px] font-bold uppercase tracking-tighter">
                  <CheckCircle className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-1">
                {name}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-[var(--color-background)] px-2 py-1 rounded-md text-xs font-medium">
              <Star className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="pt-2 flex items-baseline gap-1">
            <span className="font-bold text-lg">₹{dailyPrice}</span>
            <span className="text-xs text-[var(--color-text-secondary)]">/ day</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
