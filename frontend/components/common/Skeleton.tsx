"use client";

export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      style={{ height: "16px", width: "100%" }}
    />
  );
}
