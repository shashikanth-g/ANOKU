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
          <div className="intro-logo flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-4xl leading-none">A</span>
            </div>
            <span className="font-bold text-5xl tracking-tight text-[var(--color-primary)]">
              ANOKU
            </span>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
