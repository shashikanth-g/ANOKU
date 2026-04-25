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
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]/50">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
