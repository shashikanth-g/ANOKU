import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-xl bg-black/5 dark:bg-white/5 ${className}`}
      {...props}
    />
  );
}

export function SkeletonItemCard() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl p-4 glass border-transparent shadow-sm">
      <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
      <div className="space-y-2 mt-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]/50">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonBookingCard() {
  return (
    <div className="overflow-hidden border-none shadow-xl glass rounded-3xl p-0 flex flex-col md:flex-row">
      <Skeleton className="w-full md:w-48 h-48 md:h-auto rounded-none md:rounded-l-3xl" />
      <div className="p-6 flex-1 space-y-4">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 w-1/2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="pt-4 border-t border-[var(--color-border)]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
