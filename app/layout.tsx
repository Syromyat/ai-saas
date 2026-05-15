import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

const syne = Syne({ subsets: ["latin", "latin-ext"], variable: "--font-display", weight: ["400","500","700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "AI Tools — Умные инструменты",
  description: "ИИ-инструменты для работы, бизнеса и творчества",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Tools",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Tools" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-zinc-950 font-[var(--font-body)] antialiased">
        <nav className="border-b border-zinc-800 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-[var(--font-display)] font-bold text-white text-lg tracking-tight">
              AI Tools
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Кабинет
              </Link>
              <Link href="/history" className="text-sm text-zinc-400 hover:text-white transition-colors">
                История
              </Link>
              <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Тарифы
              </Link>
              <Link href="/referral" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Партнёрам 🎁
              </Link>
              <UserMenu />
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
