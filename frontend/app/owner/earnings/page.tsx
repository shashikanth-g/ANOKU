"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { PieChart, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

export default function EarningsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold mb-8">Earnings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card className="border-none shadow-xl bg-[var(--color-primary)] text-white">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <p className="text-sm text-white/80 font-medium">Total Balance</p>
                    <DollarSign className="w-5 h-5 opacity-50" />
                 </div>
                 <p className="text-3xl font-bold mt-2">₹12,450</p>
                 <div className="flex items-center gap-1 text-[10px] mt-4 bg-white/20 w-fit px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +12% this month
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl glass">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">Pending Payouts</p>
                    <Clock className="w-5 h-5 text-[var(--color-warning)]" />
                 </div>
                 <p className="text-3xl font-bold mt-2 text-[var(--color-text-primary)]">₹2,800</p>
                 <p className="text-[10px] text-[var(--color-text-secondary)] mt-4">Next payout: 28 Oct</p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl glass">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">Rentals This Month</p>
                    <PieChart className="w-5 h-5 text-[var(--color-primary)]" />
                 </div>
                 <p className="text-3xl font-bold mt-2 text-[var(--color-text-primary)]">08</p>
                 <p className="text-[10px] text-[var(--color-text-secondary)] mt-4">2 active currently</p>
              </CardContent>
           </Card>
        </div>

        <Card className="border-none shadow-xl glass">
           <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border)]/50 last:border-0">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                             <ArrowUpRight className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="font-bold text-sm">Rental Earnings</p>
                             <p className="text-xs text-[var(--color-text-secondary)]">22 Oct 2024 • Classic Leather Jacket</p>
                          </div>
                       </div>
                       <p className="font-bold text-[var(--color-success)]">+₹450</p>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}

import { Clock } from "lucide-react";
