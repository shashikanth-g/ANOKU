"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Lock, User as UserIcon, CheckCircle2, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

function LoginPageContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";
  const sessionExpired = searchParams.get("expired") === "true";
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      
      setToken(data.access_token);
      setAuth(data.user);
      
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
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
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {signupSuccess && (
              <div className="mb-4 p-3 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-xl border border-[var(--color-success)]/20 flex items-center gap-2 animate-in fade-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
                <p className="text-xs font-bold">Account created! Please login.</p>
              </div>
            )}
            {sessionExpired && (
              <p className="text-[var(--color-error)] text-sm text-center bg-[var(--color-error)]/10 p-3 rounded-xl border border-[var(--color-error)]/20 animate-in fade-in zoom-in duration-300">
                Session expired, please login again
              </p>
            )}
            {error && (
              <p className="text-[var(--color-error)] text-sm text-center bg-[var(--color-error)]/10 p-3 rounded-xl border border-[var(--color-error)]/20 animate-in fade-in zoom-in duration-300">
                {error}
              </p>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-[var(--color-text-primary)]">Email or Phone</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  placeholder="name@example.com" 
                  className="pl-12 h-14 text-lg rounded-2xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1 text-[var(--color-text-primary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="pl-12 h-14 text-lg rounded-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-lg mt-2" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="text-center pt-2">
               <button 
                 type="button" 
                 onClick={() => router.push("/signup")}
                 className="text-sm text-[var(--color-primary)] font-semibold hover:underline"
                >
                 Don't have an account? Sign up
               </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-xs text-[var(--color-text-secondary)]">
              By continuing, you agree to Anoku's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
