"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import Image from "next/image";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/common/Card";
import { CheckCircle2, Circle, Truck, Package, MapPin, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import Skeleton from "@/components/common/Skeleton";

const TRACKING_STEPS = [
  { id: 1, title: "Order Confirmed", time: "Oct 24, 10:30 AM", status: "completed" },
  { id: 2, title: "Pickup Scheduled", time: "Oct 25, 09:00 AM", status: "completed" },
  { id: 3, title: "Item Picked Up", time: "Oct 25, 09:45 AM", status: "current" },
  { id: 4, title: "Out for Delivery", time: "Pending", status: "upcoming" },
  { id: 5, title: "Delivered", time: "Pending", status: "upcoming" },
];

export default function TrackingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold mb-8">Track Rental</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Live Status Timeline */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Status</h2>
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                
                {TRACKING_STEPS.map((step) => (
                  <div key={step.id} className="relative flex gap-4 items-start">
                    <div className={cn(
                      "z-10 w-6 h-6 rounded-full flex items-center justify-center border-4 border-[var(--color-background)]",
                      step.status === "completed" ? "bg-[var(--color-success)] text-white" : 
                      step.status === "current" ? "bg-[var(--color-primary)] text-white animate-pulse" : 
                      "bg-gray-300 dark:bg-zinc-700"
                    )}>
                      {step.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className={cn(
                        "font-bold text-sm",
                        step.status === "upcoming" ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-[var(--color-primary)] text-white">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-xl bg-white/20">
                    <Truck className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs text-white/70">Estimated Delivery</p>
                    <p className="font-bold">Today, by 2:00 PM</p>
                 </div>
              </div>
            </Card>
          </div>

          {/* Right: Map Placeholder & Courier Info */}
          <div className="lg:col-span-2 space-y-6">
             <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-[var(--color-border)] bg-gray-100 dark:bg-zinc-900">
                {/* Map Mockup Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                   <MapPin className="w-24 h-24 text-[var(--color-primary)]" />
                </div>
                
                {/* Floating Courier Info Card */}
                <div className="absolute bottom-6 left-6 right-6">
                   <Card className="p-4 glass border-none flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden relative">
                        <Image 
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" 
                          alt="Courier Photo"
                          fill
                          className="object-cover" 
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-sm">Rahul K. (ANOKU Delivery)</p>
                         <p className="text-xs text-[var(--color-text-secondary)]">Driving white electric scooter</p>
                      </div>
                      <div className="flex gap-2">
                         <Button size="icon" variant="outline" className="rounded-full">
                            <Phone className="w-4 h-4" />
                         </Button>
                         <Button size="icon" variant="outline" className="rounded-full">
                            <MessageSquare className="w-4 h-4" />
                         </Button>
                      </div>
                   </Card>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 flex items-center gap-4">
                   <Package className="w-8 h-8 text-[var(--color-primary)]" />
                   <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Item Type</p>
                      <p className="font-bold">Classic Leather Jacket</p>
                   </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                   <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                   <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Pickup Address</p>
                      <p className="font-bold truncate max-w-[150px]">Whitefield, Bangalore</p>
                   </div>
                </Card>
             </div>
          </div>

        </div>
      </main>

      <Navigation />
    </div>
  );
}
