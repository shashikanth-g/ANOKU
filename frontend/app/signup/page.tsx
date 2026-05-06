"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { ArrowRight, Lock, User as UserIcon, Phone, Mail } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      router.push("/login?signup=success");
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
        setError("Account already exists. Please log in.");
      } else {
        setError(msg || "Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md glass border-none shadow-2xl relative z-10 p-4">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-4 shadow-lg shadow-[var(--color-primary)]/20">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <CardTitle className="text-3xl font-bold">Join Anoku</CardTitle>
          <CardDescription>Start renting and listing premium fashion</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <p className="text-[var(--color-error)] text-sm text-center bg-[var(--color-error)]/10 p-3 rounded-xl border border-[var(--color-error)]/20">
                {error}
              </p>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  name="name"
                  placeholder="John Doe" 
                  className="pl-12 h-14 rounded-2xl"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  name="email"
                  type="email"
                  placeholder="john@example.com" 
                  className="pl-12 h-14 rounded-2xl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  name="phone"
                  placeholder="9988776655" 
                  className="pl-12 h-14 rounded-2xl"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  name="password"
                  type="password"
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-lg mt-2" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="text-center pt-2">
               <button type="button" onClick={() => router.push("/login")} className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
                 Already have an account? Login
               </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
