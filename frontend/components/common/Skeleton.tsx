"use client";

export default function Skeleton() {
  return (
    <div
      style={{
        height: "16px",
        width: "100%",
        background: "#e5e7eb",
        borderRadius: "6px",
        animation: "pulse 1.5s infinite"
      }}
    />
  );
}
