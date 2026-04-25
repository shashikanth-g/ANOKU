"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Phone, Mail, MessageCircle, Truck, CreditCard, RefreshCw, AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How does delivery work?", a: "We pick up the item from the owner and deliver it to you." },
    { q: "What if the item is damaged?", a: "No damage? No charges. Minor wear is acceptable." },
    { q: "How do I return the item?", a: "Our team will pick it up from your location." },
    { q: "How do I contact support?", a: "Use phone, WhatsApp, or email above." }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-primary)]">Help & Support</h1>
        <p className="text-[var(--color-text-secondary)] text-lg">We're here to help you with your rentals</p>
      </div>

      <Card className="glass border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-black/5 dark:bg-white/5 border-b border-[var(--color-border)]/50">
          <CardTitle className="text-xl">Contact Information</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">Operated by: Shashikanth</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="tel:+919876543210" className="flex-1">
              <Button className="w-full h-14 rounded-2xl gap-2 text-md font-bold" variant="outline">
                <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                Call Now
              </Button>
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full h-14 rounded-2xl gap-2 text-md font-bold" variant="outline">
                <MessageCircle className="w-5 h-5 text-[var(--color-success)]" />
                WhatsApp
              </Button>
            </a>
            <a href="mailto:support@anoku.com" className="flex-1">
              <Button className="w-full h-14 rounded-2xl gap-2 text-md font-bold" variant="outline">
                <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                Email Support
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Delivery & Pickup</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Track and manage deliveries</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payments</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Refunds, charges, and billing</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[var(--color-warning)]/10 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-[var(--color-warning)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Returns & Damage</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Policies and condition reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[var(--color-error)]/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[var(--color-error)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Booking Issues</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Cancellations and modifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="glass border-none shadow-sm overflow-hidden">
              <button 
                className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-bold text-[var(--color-text-primary)]">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-[var(--color-text-secondary)] ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-sm font-medium text-[var(--color-text-secondary)] animate-in slide-in-from-top-2">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
