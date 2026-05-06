import PWAInstall from "@/components/PWAInstall";
import { AuthGuard } from "@/components/AuthGuard";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANOKU | Premium Fashion Rental",
  description: "Peer-to-peer fashion & accessories rental platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B6E6E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ANOKU" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-background)] intro-overlay pointer-events-none">
          <div className="intro-logo flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-[var(--color-primary)] flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-white/10">
                <span className="text-white font-bold text-5xl leading-none">A</span>
              </div>
              <span className="font-bold text-6xl tracking-tighter text-[var(--color-primary)]">
                ANOKU
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-medium text-[var(--color-text-secondary)] tracking-[0.2em] uppercase opacity-80">
                Wear the Moment
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-accent)] font-bold mt-3 border-t border-[var(--color-border)] pt-3 px-4">
                Premium Fashion Rental
              </p>
            </div>
          </div>
        </div>
        <PWAInstall />
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
