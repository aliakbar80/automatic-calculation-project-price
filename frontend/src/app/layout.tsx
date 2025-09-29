import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Sun, Moon, Computer, Github } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "محاسبه قیمت پروژه نرم‌افزاری",
  description: "پیش‌فاکتور و محاسبه قیمت پروژه بر اساس ضرایب ایران",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${vazir.variable} antialiased bg-gray-50 text-gray-900`}>
        <ThemeProvider>
          <QueryProvider>
            <header className="border-b bg-white/60 dark:bg-zinc-900/60 backdrop-blur sticky top-0 z-10">
              <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="font-bold flex items-center gap-2">
                  <span>محاسبه قیمت پروژه</span>
                </div>
                <a className="text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-400 rounded-md p-1" href="https://github.com/aliakbar80/automatic-calculation-project-price" target="_blank">
                  <Github className="w-5 h-5" />
                </a>
                <ThemeToggle />
              </div>
            </header>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
