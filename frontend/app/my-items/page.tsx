"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyItemsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/owner/items");
  }, [router]);
  return null;
}
